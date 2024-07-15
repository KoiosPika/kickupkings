export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex flex-col bg-white text-black h-screen">
            <main className="flex-1">{children}</main>
        </div>
    )

}