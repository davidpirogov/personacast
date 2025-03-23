import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VariableFormData, variableSchema } from "@/schemas/variables";
import { Variable } from "@/types/database";

interface VariableFormProps {
    onSubmit: (data: VariableFormData) => Promise<void>;
    initialData?: Variable;
    submitLabel?: string;
}

export function VariableForm({ onSubmit, initialData, submitLabel = "Save" }: VariableFormProps) {
    const form = useForm<VariableFormData>({
        resolver: zodResolver(variableSchema),
        defaultValues: {
            name: initialData?.name || "",
            value: initialData?.value || "",
        },
    });

    const handleSubmit = async (data: VariableFormData) => {
        try {
            await onSubmit(data);
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Variable name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Variable value"
                                    className="font-mono min-h-[theme(spacing.24)] resize-y"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {submitLabel}
                </Button>
            </form>
        </Form>
    );
}
