import { EditVariableForm } from "@/components/forms/admin-variable-edit";
import { variablesService } from "@/services/variables-service";
import { notFound } from "next/navigation";

interface EditVariablePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditVariablePage({ params }: EditVariablePageProps) {
    const { id } = await params;
    const variable = await variablesService.get(Number(id));

    if (!variable) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Variable</h1>
            <EditVariableForm variable={variable} />
        </div>
    );
}
