"use client"
import React, { useLayoutEffect, useState } from "react";
import ClientTable from "./Table";
import { getClientsTable } from "@/firebase/Firebase";

const ClientsPage = () => {

    const [data, setData] = useState<ClientTable[]>([]);

    useLayoutEffect(() => {
        const clientsTableData = getClientsTable();
        clientsTableData.then((clients) => {
          setData(clients);
        });
      }, []);

    return (
        <div className="border rounded-md bg-surface p-2 md:p-4">
            <ClientTable data={data}/>
        </div>
    );
}

export default ClientsPage;