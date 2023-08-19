import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";

import { db, getClients } from "../../firebase/Firebase";
import Client from "../../../types/Client";

type Person = {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	status: string;
	progress: number;
};


const columnHelper = createColumnHelper<Client>();

// Definición de columnas
const columns = [
	columnHelper.accessor("name", {
		header: () => "Nombre",
		cell: (info) => `${info.getValue()} ${info.row.original.lastname}`,
	}),
	columnHelper.accessor("tel1", {
		id: "tel",
        cell: (info) => (
            <>
                {info.row.original.tel1 && <a href={`tel:${info.row.original.tel1}`}>{info.row.original.tel1 !== 0 ? info.row.original.tel1: ""}</a>}
                {info.row.original.tel2 && <a href={`tel:${info.row.original.tel2}`}>{info.row.original.tel2 !== 0 ? info.row.original.tel2 : ""}</a>}
            </>
        ),
		header: () => "Teléfono",
	}),
	columnHelper.accessor("address.street", {
		header: () => "Dirección",
		cell: (info) =>` ${info.renderValue()} ${info.row.original.address.no}, ${info.row.original.address.colony}`,
	}),
	columnHelper.accessor("status", {
		header: () => "Estado",
	}),
	columnHelper.accessor("position", {
        header: "Acciones",
        cell: (info) => (null)
	}),
];

function ClientTable() {

    const [data, setData] = useState<Client[] >([]);
    useLayoutEffect(() => { 
        const clients = getClients(db);
        clients.then((clients) => {
            setData(clients);        
        });

    }, []);



	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<table className="bg-white items-center w-full border-collapse">
			<thead className="text-slate-900 text-sm">
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
									  )}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody className="text-slate-700 text-xs">
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id + row.original.position}>
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default ClientTable;
