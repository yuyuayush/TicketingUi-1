"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface GenericDialogProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	title: string;
	description?: string;
	isPending?: boolean;
	onSave?: () => void;
	onCancel?: () => void;
	children: React.ReactNode;
	saveLabel?: string;
	cancelLabel?: string;
	hideFooter?: boolean;
	saveButtonText?: string; // Prop is now correctly included
}

export function GenericDialog({
	open,
	setOpen,
	title,
	description,
	isPending = false,
	onSave,
	onCancel,
	children,
	saveLabel = "Save",
	cancelLabel = "Cancel",
	hideFooter = false,
	saveButtonText,
	className = "", // Accept className prop
}: GenericDialogProps & { className?: string }) {
	const finalSaveLabel = saveButtonText || saveLabel;

	return (
		<Dialog  open={open} onOpenChange={setOpen}>
			<DialogContent className={` ${className}`}> {/* Merge className */}
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				<div className="py-2 space-y-4">{children}</div>

				{!hideFooter && (
					<DialogFooter className="flex justify-end gap-2 pt-2">
						<Button
							variant="outline"
							onClick={() => {
								onCancel?.();
								setOpen(false);
							}}
						>
							{cancelLabel}
						</Button>
						{onSave && (
							<Button onClick={onSave} disabled={isPending}>
								{isPending && (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								)}
								{finalSaveLabel}
							</Button>
						)}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
