"use client";
import { LoaderCircle } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { useFormStatus } from "react-dom";

/**
 * 
 * @param props 
 * @returns 
 */
export function SubmitButton(props: Omit<ButtonProps, "type">) {
  const { pending } = useFormStatus();
  const { disabled, children, ...reset } = props;
  return (
    <Button disabled={pending || disabled} type="submit" {...reset}>
      {pending && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
      {children}
    </Button>
  );
}
