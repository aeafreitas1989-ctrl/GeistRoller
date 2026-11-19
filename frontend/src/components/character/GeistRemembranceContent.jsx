import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { effectiveGeistRank } from '../../utils/remembranceRules';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KEYS, MERIT_LIST, SKILL_LIST } from "../../data/character-data";
import { formatLabel } from "./StatComponents";

export const GeistRemembranceContent = ({
    getValue, handleChange,
    geistRank, currentSynergy, synergyData, onCompleteRemembrance, onActivateRemembrance, currentPlasm,
}) => {
    const [selectedDots,setSelectedDots] = useState(1);
    const rankLimit = effectiveGeistRank({ synergy: currentSynergy, geist_rank: geistRank });
    const active = getValue('remembrance_activation');
    return (
        <>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Name</label>
                <Input value={getValue("geist_name") || ""} onChange={(e) => handleChange("geist_name", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The name of your bound geist" data-testid="geist-name-input" />
            </div>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Rank</label>
                <Input
                    type="number"
                    min={1}
                    max={10}
                    value={geistRank}
                    onChange={(e) => handleChange("geist_rank", parseInt(e.target.value, 10) || 1)}
                    className="input-geist h-8 text-sm mt-0.5"
                    data-testid="geist-rank-input"
                />
            </div>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Description</label>
                <Textarea value={getValue("geist_description") || ""} onChange={(e) => handleChange("geist_description", e.target.value)} className="input-geist mt-0.5 min-h-[50px] text-sm" placeholder="Describe your geist's appearance..." data-testid="geist-description-textarea" />
            </div>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist's Innate Key</label>
                <Select value={getValue("geist_innate_key") || ""} onValueChange={(v) => handleChange("geist_innate_key", v)}>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="geist-innate-key-select"><SelectValue placeholder="Select Geist's Key..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        {KEYS.map((k) => (<SelectItem key={k} value={k} className="text-zinc-200">{k}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Remembrance Trait</label>
                <div className="grid grid-cols-2 gap-2">
                    <Select value={getValue("remembrance_trait_type") || ""} onValueChange={(v) => handleChange("remembrance_trait_type", v)}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="remembrance-trait-type-select"><SelectValue placeholder="Skill or Merit" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="skill" className="text-zinc-200">Skill</SelectItem>
                            <SelectItem value="merit" className="text-zinc-200">Merit</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={getValue("remembrance_trait") || ""} onValueChange={(v) => handleChange("remembrance_trait", v)}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="remembrance-trait-select"><SelectValue placeholder="Select trait" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {(getValue("remembrance_trait_type") || "") === "merit"
                                ? MERIT_LIST.map((merit) => (
                                    <SelectItem key={merit.name} value={merit.name} className="text-zinc-200">{merit.name}</SelectItem>
                                ))
                                : SKILL_LIST.map((skillKey) => (
                                    <SelectItem key={skillKey} value={skillKey} className="text-zinc-200">{formatLabel(skillKey)}</SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Virtue</label>
                    <Input value={getValue("virtue") || ""} onChange={(e) => handleChange("virtue", e.target.value)} className="input-geist h-8 text-sm mt-0.5" data-testid="virtue-input" />
                </div>
                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Vice</label>
                    <Input value={getValue("vice") || ""} onChange={(e) => handleChange("vice", e.target.value)} className="input-geist h-8 text-sm mt-0.5" data-testid="vice-input" />
                </div>
            </div>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ban</label>
                <Input value={getValue("ban") || ""} onChange={(e) => handleChange("ban", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The Geist's Ban..." data-testid="ban-input" />
            </div>
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bane</label>
                <Input value={getValue("bane") || ""} onChange={(e) => handleChange("bane", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The Geist's Bane..." data-testid="bane-input" />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Remembrances</label>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={!!getValue("remembrance_1_complete")}
                        onCheckedChange={(checked) => checked && onCompleteRemembrance?.(1)}
                        className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        data-testid="remembrance-1-check"
                    />
                    <Input value={getValue("remembrance_1") || ""} onChange={(e) => handleChange("remembrance_1", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="First Remembrance..." data-testid="remembrance-1-input" />
                </div>
                {getValue("remembrance_1_complete") && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={!!getValue("remembrance_2_complete")}
                            onCheckedChange={(checked) => checked && onCompleteRemembrance?.(2)}
                        className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                            data-testid="remembrance-2-check"
                        />
                        <Input value={getValue("remembrance_2") || ""} onChange={(e) => handleChange("remembrance_2", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="Second Remembrance..." data-testid="remembrance-2-input" />
                    </div>
                )}
                {getValue("remembrance_2_complete") && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={!!getValue("remembrance_3_complete")}
                            onCheckedChange={(checked) => checked && onCompleteRemembrance?.(3)}
                        className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                            data-testid="remembrance-3-check"
                        />
                        <Input value={getValue("remembrance_3") || ""} onChange={(e) => handleChange("remembrance_3", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="Third Remembrance..." data-testid="remembrance-3-input" />
                    </div>
                )}
                <p className="text-[9px] text-zinc-600">Complete in sequence. Completed milestones are irreversible here; Storyteller corrections use the character editor.</p>
                <div className="rounded border border-cyan-800/40 p-2 space-y-2" data-testid="remembrance-activation">
                    <p className="text-[10px] text-cyan-300">Remembrance Trait (effective Rank {rankLimit})</p>
                    {active?.status === 'active' ? (
                        <p className="text-xs text-teal-300">Active until End Scene: +{active.dots} {active.trait_type === 'skill' ? 'Skill' : 'Merit'} dot(s) to {active.trait}.</p>
                    ) : (
                        <>
                            <select className="w-full bg-zinc-950 p-1 text-xs" value={selectedDots} onChange={(event) => setSelectedDots(Number(event.target.value))} data-testid="remembrance-activation-dots">
                                {Array.from({length:rankLimit},(_,i)=>i+1).map((v)=><option key={v} value={v}>{v} dot(s) · {v} Plasm</option>)}
                            </select>
                            <Button size="sm" type="button" className="h-7 w-full" disabled={!getValue('remembrance_trait') || !getValue('remembrance_trait_type') || currentPlasm < selectedDots} onClick={() => onActivateRemembrance?.(selectedDots)} data-testid="activate-remembrance-btn">Spend Plasm · Activate for scene</Button>
                        </>
                    )}
                </div>
            </div>
            <div className="p-2 bg-teal-900/10 border border-teal-500/20 rounded-sm">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-teal-400 uppercase tracking-wider">Relationship</span>
                    <span className="text-sm font-heading text-teal-300">{synergyData.relationship}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Based on Synergy {currentSynergy}</p>
            </div>
        </>
    );
};
