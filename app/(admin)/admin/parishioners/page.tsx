import { getAllParishioners } from "@/actions/parishioners";
import { PaginationComponent } from "@/components/layout/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";
import React from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Parishioners(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const page = parseInt((searchParams["page"] as string) ?? "1", 10);

  const limit = 5;
  const parishioner = await getAllParishioners(page, limit);

  //   const DUMMYVALUES = [
  //     {
  //       name: "Test",
  //       email: "test@gmail.com",
  //       phone: "23222",
  //       role: "PARISHIONER",
  //       createdAt: new Date(),
  //     },
  //     {
  //       name: "Test",
  //       email: "test@gmail.com",
  //       phone: "23222",
  //       role: "PARISHIONER",
  //       createdAt: new Date(),
  //     },
  //   ];

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Active Parishioners
        </h1>
        <p className="text-gray-600 mb-8">
          Review and manage active parishioners.
        </p>
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{`Parishioners (${parishioner.totalCount})`}</CardTitle>
            </CardHeader>
            <CardContent>
              {(parishioner.allParishioners ?? []).length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(parishioner.allParishioners ?? []).map((info) => (
                          <tr key={info.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {info.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {info.phone ? info.phone : "No phone number"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {info.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {info.role}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(info.createdAt)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatTime(info.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {Number(parishioner.totalCount) < 5 ? null : (
                    <PaginationComponent
                      limit={limit}
                      totalItems={Number(parishioner.totalCount)}
                      siblingCount={1}
                      pageParam="page"
                    />
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No parishioners.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
