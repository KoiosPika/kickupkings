export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex flex-col bg-slate-300 text-black h-screen w-full justify-center items-center">
            <main className="flex-1 max-w-[500px] w-full bg-white">{children}</main>
        </div>
    )

}