import { User } from "@/types/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UsersService } from "@/services/users-service";
import { DeleteUserDialog } from "@/components/dialogs/delete-user-dialog";

const usersService = new UsersService();

async function getUsers() {
    return usersService.getAllUsers();
}

export async function UsersTable() {
    const users = await getUsers();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    {user.image && (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    )}
                                    {user.name}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === "podcaster:admin" ? "destructive" : "default"}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.isActive ? "default" : "secondary"}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Link href={`/admin/users/edit/${user.id}`}>
                                        <Button variant="outline" size="icon">
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <DeleteUserDialog user={user} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
