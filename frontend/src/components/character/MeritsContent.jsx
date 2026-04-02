import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MERIT_LIST, CEREMONY_LIST } from "../../data/character-data";
import { StatDots } from "./StatComponents";
import { MeritCard, CeremonyCard } from "./CardComponents";

export const MeritsContent = ({
    isMage,
    meritsList, sortedMeritsList, deleteMerit, updateMerit,
    showMeritDialog, setShowMeritDialog,
    newMeritName, setNewMeritName, newMeritDots, setNewMeritDots,
    addMerit, openDicePopup,
    selectedMerit, minDotsForMerit, maxDotsForMerit, isFixedDotMerit, getMeritDotDisplay,
    ceremoniesList, sortedCeremoniesList,
    showCeremonyDialog, setShowCeremonyDialog,
    newCeremonyName, setNewCeremonyName,
    addCeremony, deleteCeremony, rollCeremonyFromCharacter,
}) => {
    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Merits</label>
                    <Dialog open={showMeritDialog} onOpenChange={setShowMeritDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-5 px-2 text-[10px] btn-secondary" data-testid="open-add-merit-dialog"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">Add Merit</DialogTitle>
                                <DialogDescription className="text-zinc-400">Select a merit and set its rating</DialogDescription>
                            </DialogHeader>
                            <Select value={newMeritName} onValueChange={(v) => {
                                setNewMeritName(v);
                                const merit = MERIT_LIST.find(m => m.name === v);
                                if (merit) {
                                    const min = merit.minDots || 1;
                                    const max = merit.maxDots || 5;
                                    if (min === max) {
                                        setNewMeritDots(max);
                                    } else if (newMeritDots < min) {
                                        setNewMeritDots(min);
                                    } else if (newMeritDots > max) {
                                        setNewMeritDots(max);
                                    }
                                }
                            }}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="select-merit-dropdown"><SelectValue placeholder="Select merit..." /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                                    {MERIT_LIST.map((m) => (
                                        <SelectItem key={m.name} value={m.name} className="text-zinc-200">
                                            {m.name} ({getMeritDotDisplay(m)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="space-y-2">
                                <Input value={newMeritName} onChange={(e) => setNewMeritName(e.target.value)} placeholder="Or enter custom merit name" className="input-geist" data-testid="custom-merit-name-input" />
                                {!isFixedDotMerit && (
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-zinc-400">Rating ({minDotsForMerit} to {maxDotsForMerit}):</label>
                                        <StatDots value={newMeritDots} max={maxDotsForMerit} onChange={(v) => setNewMeritDots(Math.max(minDotsForMerit, v))} color="amber" testIdPrefix="new-merit-rating" />
                                    </div>
                                )}
                                {isFixedDotMerit && selectedMerit && (
                                    <p className="text-xs text-zinc-500">This merit has a fixed rating of {maxDotsForMerit} dot{maxDotsForMerit > 1 ? 's' : ''}.</p>
                                )}
                            </div>
                            <Button onClick={addMerit} className="w-full btn-primary" disabled={!newMeritName} data-testid="add-merit-btn">Add Merit</Button>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="space-y-1">
                    {meritsList.length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic">No merits added</p>
                    ) : (
                        sortedMeritsList.map((merit, index) => (
                            <MeritCard
                                key={merit.id || index}
                                merit={merit}
                                index={index}
                                onDelete={() => deleteMerit(merit.id || null)}
                                onUpdate={(data) => updateMerit(merit.id || null, data)}
                                onRollPerception={() => openDicePopup("perception")}
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* Ceremonies Section - Geist only */}
            {!isMage && (
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-violet-400 uppercase tracking-wider">Ceremonies</label>
                    <Dialog open={showCeremonyDialog} onOpenChange={setShowCeremonyDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-5 px-2 text-[10px] bg-violet-900/30 border border-violet-500/50 text-violet-200 hover:bg-violet-800/40" data-testid="open-add-ceremony-dialog">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">Add Ceremony</DialogTitle>
                                <DialogDescription className="text-zinc-400">Select a krewe ceremony to learn</DialogDescription>
                            </DialogHeader>
                            <Select value={newCeremonyName} onValueChange={setNewCeremonyName}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="select-ceremony-dropdown">
                                    <SelectValue placeholder="Select ceremony..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
                                    {[1, 2, 3, 4, 5].map(dotLevel => (
                                        <div key={dotLevel}>
                                            <div className="px-2 py-1 text-[10px] text-violet-400 uppercase tracking-wider bg-zinc-800/50">
                                                {"●".repeat(dotLevel)} {dotLevel}-Dot Ceremonies
                                            </div>
                                            {CEREMONY_LIST.filter(c => c.dots === dotLevel).map((c) => (
                                                <SelectItem key={c.name} value={c.name} className="text-zinc-200">
                                                    <div className="flex flex-col">
                                                        <span>{c.name}</span>
                                                        <span className="text-[10px] text-teal-400">{c.dicePool}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="space-y-2">
                                <Input 
                                    value={newCeremonyName} 
                                    onChange={(e) => setNewCeremonyName(e.target.value)} 
                                    placeholder="Or enter custom ceremony name" 
                                    className="input-geist" 
                                    data-testid="custom-ceremony-name-input" 
                                />
                            </div>
                            <Button onClick={addCeremony} className="w-full bg-violet-900/50 border border-violet-500/50 text-violet-200 hover:bg-violet-800/50" disabled={!newCeremonyName} data-testid="add-ceremony-btn">
                                Add Ceremony
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="space-y-1">
                    {ceremoniesList.length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic">No ceremonies learned</p>
                    ) : (
                        sortedCeremoniesList.map((ceremony, index) => (
                            <CeremonyCard
                                key={index}
                                ceremony={ceremony}
                                index={index}
                                onDelete={() => deleteCeremony(index)}
                                onRoll={() => rollCeremonyFromCharacter(ceremony.name)}
                            />
                        ))
                    )}
                </div>
            </div>
            )}
        </>
    );
};
