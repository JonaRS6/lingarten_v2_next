import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";

import { getClientsTable } from "../../firebase/Firebase";
import Client, { ClientTable } from "../../../types/Client";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const columnHelper = createColumnHelper<ClientTable>();

// Definición de columnas
const columns = [
  columnHelper.accessor("clientName", {
    header: () => "Nombre",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: () => "Teléfono",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("fullAddress", {
    header: () => "Dirección",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Estado",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    header: "Acciones",
    cell: (info) => null,
  }),
];

function ClientTable() {
  const [data, setData] = useState<ClientTable[]>([]);
  useLayoutEffect(() => {
    const clientsTableData = getClientsTable();
    clientsTableData.then((clients) => {
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
      <thead className="text-sm">
        <tr>
          <th>Nombre</th>
          <th className="hidden md:table-cell">Dirección</th>
          <th>Status</th>
          <th> </th>
        </tr>
      </thead>
      <tbody className="text-xs">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            <td className="p-2 md:px-4 h-[68px] md:h-[52px]">
              <span className="block mb-1 font-medium">{row.original.clientName}</span>
              <span className="block md:hidden">{row.original.fullAddress}</span>
              {
                // si tiene teléfono, mostrarlo
                row.original.phone && (
                  <a
                    href={`tel:${row.original.phone}`}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {row.original.phone}
                  </a>
                )
              }
            </td>
            <td className="hidden md:table-cell md:px-4">{row.original.fullAddress}</td>
            <td className="p-2 md:px-4">
              <div className="flex justify-center">
                <StatusBadgeButton status={row.original.status} />
              </div>
            </td>
            <td className="p-2 md:px-4">...</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type StatusBadgeProps = {
  status: "pagado" | "pendiente" | "cancelado" | "atrasado";
};
/**
 * Badge de estado de cliente
 *
 * @description Muestra el estado del cliente en un badge
 * con un botón para cambiarlo. En resoluciones pequeñas
 * se muestra como un ciruculo sin texto. En resoluciones grandes
 * se muestra como un badge con texto.
 * @param status Estado del cliente
 * @returns
 */
function StatusBadgeButton({ status }: StatusBadgeProps) {
  /**
   * Estilos del badge
   * para pagado el color es verde,
   * para pendiente el color es amarillo,
   * para atrasado el color es rojo,
   * para cancelado el color es gris.
   */
  const badgeStyles = {
    pagado: "bg-green-600 md:bg-green-200 text-green-900 border-green-900",
    pendiente: "bg-yellow-500 md:bg-yellow-200 text-yellow-900 border-yellow-900",
    cancelado: "bg-gray-600 md:bg-gray-200 text-gray-900 border-gray-900",
    atrasado: "bg-red-600 md:bg-red-200 text-red-900 border-red-900",
  };
  return (
    <button
      className={`${badgeStyles[status]} w-4 h-4 md:w-auto md:h-auto border md:border-none rounded-full font-semibold text-xs md:px-3 md:py-1`}
    >
      <span className="hidden md:inline capitalize">{status}</span>
    </button>
  );
}

export default ClientTable;
