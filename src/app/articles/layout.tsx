import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
}
