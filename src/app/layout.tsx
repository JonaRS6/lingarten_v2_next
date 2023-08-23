import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";


 
const roboto = Roboto({
	weight: ['400', '500', '700', '900'],
	subsets: ['latin'],
	display: 'swap',
  })

export const metadata: Metadata = {
	title: "Lingarten",
	description: "Lingarten CRM app",
};


export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={roboto.className}>{children}</body>
		</html>
	);
}
