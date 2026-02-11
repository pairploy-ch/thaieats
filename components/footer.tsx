export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-5 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
        <p className="text-muted-foreground text-xs md:text-sm text-center">
          &copy; 2026 THAI STREET EATS All rights reserved.
        </p>
        {/* <a
          href="#"
          className="text-muted-foreground text-xs md:text-sm hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a> */}
      </div>
    </footer>
  );
}
