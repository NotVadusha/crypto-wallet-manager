import MyWallet from "@/components/cards/MyWalletCard/MyWalletCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center dark:bg-black sm:items-start">
        <div className="flex flex-row w-full items-center justify-center">
          <MyWallet />
        </div>
      </main>
    </div>
  );
}
