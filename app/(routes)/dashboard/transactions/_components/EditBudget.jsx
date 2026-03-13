"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Input } from "@/components/ui/input";
import { useUser } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';

function EditBudget({ budgetInfo, refreshData }) {
    const [emoji, setEmoji] = useState("😄");
    const [openPicker, setOpenPicker] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (budgetInfo) {
            setEmoji(budgetInfo.icon || "😄");
            setName(budgetInfo.name || "");
            setAmount(budgetInfo.amount || "");
            setCategory(budgetInfo.category || "");
        }
    }, [budgetInfo]);

    const onUpdateBudget = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/budgets/${budgetInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    amount: Number(amount),
                    icon: emoji,
                    category
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Budget Updated",
                    description: "Success!",
                });
                refreshData();
            } else {
                toast({
                    title: "Error",
                    description: data.error || "Failed to update budget",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error updating budget:', error);
            toast({
                title: "Error",
                description: "Failed to update budget",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-green-500 flex gap-2"><Edit />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                        <div className='mt-5'>
                            <Button className="text-lg" variant="outline" onClick={() => setOpenPicker(!openPicker)}>{emoji}</Button>
                            {openPicker && (
                                <div className='absolute z-20'>
                                    <EmojiPicker onEmojiClick={(e) => { setEmoji(e.emoji); setOpenPicker(false); }} />
                                </div>
                            )}
                        </div>

                        <div className='mt-2'>
                            <h2 className='text-black bold'>Budget Name</h2>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="eg. Groceries" />
                        </div>

                        <div className='mt-2'>
                            <h2 className='text-black bold'>Amount</h2>
                            <Input value={amount} type="number" onChange={(e) => setAmount(e.target.value)} placeholder="eg. 3000" />
                        </div>

                        <div className='mt-2'>
                            <h2 className='text-black bold'>Category</h2>
                            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="eg. Food, Education" />
                        </div>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={onUpdateBudget} disabled={!(name && amount) || loading} className="mt-5">
                                {loading ? "Updating..." : "Update Budget"}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditBudget;
