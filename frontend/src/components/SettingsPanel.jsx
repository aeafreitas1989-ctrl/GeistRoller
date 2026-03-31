import { useState, useEffect } from "react";
import { Save, RotateCcw, Eye, EyeOff, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULTS = {
    scene_summary_level: "standard",
    suggest_rolls: true,
    include_modifiers: true,
    supernatural_presence: "average",
    escalation_speed: "gradual",
    opposition_competence: "competent",
    lethality_bias: "neutral",
    raw_strictness: "raw_with_interpretation",
    storyteller_doctrine: "",
    tone_description: "",
    chronicle_scope: "",
    setting_constraints: "",
    npc_behavioral_rules: "",
    writing_style: "",
    additional_info: "",
    external_llm_provider: "",
    external_llm_api_key: "",
    external_llm_model: "",
    external_llm_base_url: "",
};

const LLM_PROVIDERS = [
    { value: "none", label: "Emergent (Default)", base_url: "", model_hint: "", needsKey: true },
    { value: "openrouter", label: "OpenRouter", base_url: "https://openrouter.ai/api/v1", model_hint: "e.g., openai/gpt-4o, anthropic/claude-sonnet-4, meta-llama/llama-3.3-70b-instruct", needsKey: true },
    { value: "openai", label: "OpenAI", base_url: "https://api.openai.com/v1", model_hint: "e.g., gpt-4o, gpt-4o-mini", needsKey: true },
    { value: "ollama", label: "Ollama (Local)", base_url: "http://localhost:11434/v1", model_hint: "e.g., llama3.2, mistral, deepseek-r1", needsKey: false },
    { value: "custom", label: "Custom (OpenAI-compatible)", base_url: "", model_hint: "Any model name supported by your endpoint", needsKey: false },
];

const SettingSelect = ({ label, description, value, onChange, options, testId }) => (
    <div className="space-y-1" data-testid={testId}>
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid={`${testId}-trigger`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-zinc-200">
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {description && <p className="text-[9px] text-zinc-600 leading-relaxed">{description}</p>}
    </div>
);

const SettingToggle = ({ label, description, checked, onChange, testId }) => (
    <div className="flex items-center justify-between py-1" data-testid={testId}>
        <div className="flex-1 mr-3">
            <span className="text-xs text-zinc-300">{label}</span>
            {description && <p className="text-[9px] text-zinc-600">{description}</p>}
        </div>
        <Switch checked={checked} onCheckedChange={onChange} data-testid={`${testId}-switch`} />
    </div>
);

const FreeTextField = ({ label, value, onChange, placeholder, testId }) => (
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</label>
        <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-geist min-h-[50px] text-xs resize-y"
            data-testid={testId}
        />
    </div>
);

export const SettingsPanel = ({ settings, onSettingsChange }) => {
    const [local, setLocal] = useState({ ...DEFAULTS });
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [openSections, setOpenSections] = useState({
        behavior: true,
        custom: false,
        llm: false,
    });

    useEffect(() => {
        if (settings) {
            setLocal({ ...DEFAULTS, ...settings });
            setDirty(false);
        }
    }, [settings]);

    const update = (field, value) => {
        setLocal((prev) => ({ ...prev, [field]: value }));
        setDirty(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            const response = await axios.put(`${API}/settings`, local);
            onSettingsChange(response.data);
            setDirty(false);
            toast.success("Settings saved");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const resetDefaults = () => {
        setLocal({ ...DEFAULTS });
        setDirty(true);
    };

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="h-full flex flex-col" data-testid="settings-panel">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Storyteller AI Settings</span>
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetDefaults}
                        className="h-6 px-2 text-[10px] text-zinc-500 hover:text-zinc-300"
                        data-testid="settings-reset-btn"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                    <Button
                        size="sm"
                        onClick={save}
                        disabled={!dirty || saving}
                        className="h-6 px-3 text-[10px] btn-primary"
                        data-testid="settings-save-btn"
                    >
                        <Save className="w-3 h-3 mr-1" /> {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                    {/* Behavior Settings */}
                    <Collapsible open={openSections.behavior}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection("behavior")}
                            className="flex items-center justify-between w-full p-2 rounded-sm bg-teal-900/20 border border-teal-500/30 hover:bg-teal-900/30"
                            data-testid="section-toggle-behavior"
                        >
                            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">AI Behavior</span>
                            {openSections.behavior ? <ChevronDown className="w-4 h-4 text-teal-500" /> : <ChevronRight className="w-4 h-4 text-teal-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            <SettingSelect
                                label="Scene Summary Level"
                                value={local.scene_summary_level}
                                onChange={(v) => update("scene_summary_level", v)}
                                options={[
                                    { value: "off", label: "Off" },
                                    { value: "brief", label: "Brief" },
                                    { value: "standard", label: "Standard" },
                                    { value: "detailed", label: "Detailed" },
                                ]}
                                testId="setting-scene-summary"
                            />

                            <SettingToggle
                                label="Suggest rolls when relevant"
                                checked={local.suggest_rolls}
                                onChange={(v) => update("suggest_rolls", v)}
                                testId="setting-suggest-rolls"
                            />

                            {local.suggest_rolls && (
                                <SettingToggle
                                    label="Include modifiers with roll suggestions"
                                    description="Show penalties, bonuses, and equipment modifiers"
                                    checked={local.include_modifiers}
                                    onChange={(v) => update("include_modifiers", v)}
                                    testId="setting-include-modifiers"
                                />
                            )}

                            <SettingSelect
                                label="Supernatural Presence"
                                description="How common are supernatural beings in the world?"
                                value={local.supernatural_presence}
                                onChange={(v) => update("supernatural_presence", v)}
                                options={[
                                    { value: "low", label: "Low (1:100,000)" },
                                    { value: "average", label: "Average (1:10,000)" },
                                    { value: "high", label: "High (1:1,000)" },
                                ]}
                                testId="setting-supernatural-presence"
                            />

                            <SettingSelect
                                label="Escalation Speed"
                                description="How fast do scenes ramp up in tension?"
                                value={local.escalation_speed}
                                onChange={(v) => update("escalation_speed", v)}
                                options={[
                                    { value: "slow_burn", label: "Slow Burn" },
                                    { value: "gradual", label: "Gradual" },
                                    { value: "sharp", label: "Sharp" },
                                    { value: "aggressive", label: "Aggressive" },
                                ]}
                                testId="setting-escalation-speed"
                            />

                            <SettingSelect
                                label="Opposition Competence"
                                description="How smart and prepared are enemies?"
                                value={local.opposition_competence}
                                onChange={(v) => update("opposition_competence", v)}
                                options={[
                                    { value: "flawed", label: "Flawed" },
                                    { value: "competent", label: "Competent" },
                                    { value: "elite", label: "Elite" },
                                ]}
                                testId="setting-opposition-competence"
                            />

                            <SettingSelect
                                label="Lethality Bias"
                                description="How dangerous is the world?"
                                value={local.lethality_bias}
                                onChange={(v) => update("lethality_bias", v)}
                                options={[
                                    { value: "protective", label: "Protective" },
                                    { value: "neutral", label: "Neutral" },
                                    { value: "dangerous", label: "Dangerous" },
                                ]}
                                testId="setting-lethality-bias"
                            />

                            <SettingSelect
                                label="RAW Strictness"
                                description="How closely should rules be followed?"
                                value={local.raw_strictness}
                                onChange={(v) => update("raw_strictness", v)}
                                options={[
                                    { value: "strict_raw", label: "Strict RAW" },
                                    { value: "raw_with_interpretation", label: "RAW with Interpretation" },
                                    { value: "narrative_priority", label: "Narrative Priority" },
                                ]}
                                testId="setting-raw-strictness"
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Custom Directives */}
                    <Collapsible open={openSections.custom}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection("custom")}
                            className="flex items-center justify-between w-full p-2 rounded-sm bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50"
                            data-testid="section-toggle-custom-directives"
                        >
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Custom Directives</span>
                            {openSections.custom ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            <FreeTextField
                                label="Storyteller Doctrine"
                                value={local.storyteller_doctrine}
                                onChange={(v) => update("storyteller_doctrine", v)}
                                placeholder="Core principles for the Storyteller..."
                                testId="setting-storyteller-doctrine"
                            />
                            <FreeTextField
                                label="Tone Description"
                                value={local.tone_description}
                                onChange={(v) => update("tone_description", v)}
                                placeholder="e.g., Gothic noir, bleak but hopeful..."
                                testId="setting-tone-description"
                            />
                            <FreeTextField
                                label="Chronicle Scope"
                                value={local.chronicle_scope}
                                onChange={(v) => update("chronicle_scope", v)}
                                placeholder="e.g., Street-level, city-wide conspiracy..."
                                testId="setting-chronicle-scope"
                            />
                            <FreeTextField
                                label="Setting Constraints"
                                value={local.setting_constraints}
                                onChange={(v) => update("setting_constraints", v)}
                                placeholder="e.g., Set in modern-day New Orleans..."
                                testId="setting-setting-constraints"
                            />
                            <FreeTextField
                                label="NPC Behavioral Rules"
                                value={local.npc_behavioral_rules}
                                onChange={(v) => update("npc_behavioral_rules", v)}
                                placeholder="e.g., NPCs should have distinct speech patterns..."
                                testId="setting-npc-rules"
                            />
                            <FreeTextField
                                label="Writing Style"
                                value={local.writing_style}
                                onChange={(v) => update("writing_style", v)}
                                placeholder="e.g., Terse and punchy, literary prose..."
                                testId="setting-writing-style"
                            />
                            <FreeTextField
                                label="Additional Info"
                                value={local.additional_info}
                                onChange={(v) => update("additional_info", v)}
                                placeholder="Any other instructions for the AI..."
                                testId="setting-additional-info"
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* External LLM Configuration */}
                    <Collapsible open={openSections.llm}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection("llm")}
                            className="flex items-center justify-between w-full p-2 rounded-sm bg-violet-900/20 border border-violet-500/30 hover:bg-violet-900/30"
                            data-testid="section-toggle-external-llm"
                        >
                            <div className="flex items-center gap-2">
                                <Unplug className="w-3.5 h-3.5 text-violet-400" />
                                <span className="text-xs font-mono uppercase tracking-wider text-violet-400">External LLM</span>
                                {local.external_llm_provider && local.external_llm_api_key && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-green-900/40 text-green-400 border border-green-500/30">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                            {openSections.llm ? <ChevronDown className="w-4 h-4 text-violet-500" /> : <ChevronRight className="w-4 h-4 text-violet-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Connect your own LLM instead of the built-in Emergent key. Supports any OpenAI-compatible API.
                            </p>

                            <div className="space-y-1" data-testid="setting-llm-provider">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Provider</label>
                                <Select
                                    value={local.external_llm_provider || "none"}
                                    onValueChange={(v) => {
                                        const actualValue = v === "none" ? "" : v;
                                        const provider = LLM_PROVIDERS.find(p => p.value === v);
                                        update("external_llm_provider", actualValue);
                                        if (provider && provider.base_url) {
                                            update("external_llm_base_url", provider.base_url);
                                        }
                                        if (v === "none") {
                                            update("external_llm_api_key", "");
                                            update("external_llm_model", "");
                                            update("external_llm_base_url", "");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="setting-llm-provider-trigger">
                                        <SelectValue placeholder="Select provider..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {LLM_PROVIDERS.map((p) => (
                                            <SelectItem key={p.value} value={p.value} className="text-zinc-200">
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {local.external_llm_provider && (
                                <>
                                    <div className="space-y-1" data-testid="setting-llm-api-key">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                            API Key
                                            {!(LLM_PROVIDERS.find(p => p.value === (local.external_llm_provider || "none"))?.needsKey) && (
                                                <span className="text-zinc-600 normal-case ml-1">(optional)</span>
                                            )}
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showApiKey ? "text" : "password"}
                                                value={local.external_llm_api_key}
                                                onChange={(e) => update("external_llm_api_key", e.target.value)}
                                                placeholder={LLM_PROVIDERS.find(p => p.value === (local.external_llm_provider || "none"))?.needsKey ? "sk-..." : "Leave blank if not required"}
                                                className="bg-zinc-900/50 border-zinc-800 h-8 text-sm pr-9 font-mono"
                                                data-testid="setting-llm-api-key-input"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="absolute right-0 top-0 h-8 w-8 text-zinc-500 hover:text-zinc-300"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                            >
                                                {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1" data-testid="setting-llm-model">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Model</label>
                                        <Input
                                            value={local.external_llm_model}
                                            onChange={(e) => update("external_llm_model", e.target.value)}
                                            placeholder={LLM_PROVIDERS.find(p => p.value === local.external_llm_provider)?.model_hint || "Model name"}
                                            className="bg-zinc-900/50 border-zinc-800 h-8 text-sm font-mono"
                                            data-testid="setting-llm-model-input"
                                        />
                                    </div>

                                    <div className="space-y-1" data-testid="setting-llm-base-url">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Base URL</label>
                                        <Input
                                            value={local.external_llm_base_url}
                                            onChange={(e) => update("external_llm_base_url", e.target.value)}
                                            placeholder="https://..."
                                            className="bg-zinc-900/50 border-zinc-800 h-8 text-sm font-mono"
                                            data-testid="setting-llm-base-url-input"
                                        />
                                        <p className="text-[9px] text-zinc-600">
                                            {local.external_llm_provider === "custom" 
                                                ? "Enter the base URL of your OpenAI-compatible endpoint" 
                                                : local.external_llm_provider === "ollama"
                                                ? "Default: http://localhost:11434/v1. Change if Ollama runs on a different host/port."
                                                : "Auto-filled. Change only if using a proxy."}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </ScrollArea>
        </div>
    );
};

export default SettingsPanel;