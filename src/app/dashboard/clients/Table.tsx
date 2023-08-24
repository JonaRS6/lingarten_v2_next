import React from "react";
import {
  FilterFn,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

import { ClientTable } from "../../../../types/Client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPhone, faSearch } from "@fortawesome/free-solid-svg-icons";

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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Obtener el rango del item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Almacenar la información de rango del item
  addMeta({
    itemRank,
  });

  // Retornar si el item debe ser filtrado
  return itemRank.passed;
};

function ClientTable({ data }: { data: ClientTable[] }) {
  /**
   * Implementación de búsqueda
   */
  const [searchQuery, setSearchQuery] = React.useState("");
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="flex relative ">
        <div className="absolute h-full w-8 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faSearch}
            className="text-slate-500 m-0 "
            size="sm"
          />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" bg-gray-100 p-2 pl-8 rounded-md w-full md:w-auto"
        />
      </div>
      <table className="items-center w-full border-collapse">
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
                <span className="block mb-1 font-medium">
                  {row.original.clientName}
                </span>
                <span className="block md:hidden">
                  <FontAwesomeIcon
                    icon={faHome}
                    className="mr-2 text-slate-500"
                    size="xs"
                  />
                  {row.original.fullAddress}
                </span>
                {
                  // si tiene teléfono, mostrarlo
                  row.original.phone && (
                    <a
                      href={`tel:${row.original.phone}`}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="mr-2"
                        size="xs"
                      />
                      {row.original.phone}
                    </a>
                  )
                }
              </td>
              <td className="hidden md:table-cell md:px-4">
                {row.original.fullAddress}
              </td>
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
    </div>
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
    pendiente:
      "bg-yellow-500 md:bg-yellow-200 text-yellow-900 border-yellow-900",
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
