import React from "react";

import { LayoutProps } from "../../../.next/types/app/layout";

export default function DashboardLayout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen">
			Dashboard Layout
			<section className="p-2 md:p-4">{children}</section>
		</div>
	);
}
