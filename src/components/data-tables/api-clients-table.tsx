import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ApiClientsService } from "@/services/api-clients-service";
import { DeleteApiClientDialog } from "@/components/dialogs/delete-api-client-dialog";

export async function ApiClientsTable() {
    const clients = await new ApiClientsService().getAllClients();

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.description}</TableCell>
                            <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Link href={`/admin/api-clients/edit?id=${client.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <DeleteApiClientDialog client={client} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
