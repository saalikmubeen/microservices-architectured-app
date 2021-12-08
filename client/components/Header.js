import Link from "next/link";

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Sign Up", href: "/auth/signUp" },
        !currentUser && { label: "Sign In", href: "/auth/signIn" },
        currentUser && { label: "Sell Tickets", href: "/tickets/new" },
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser && { label: "signOut", href: "/auth/signOut" },
    ]
        .filter((link) => link)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <a className="nav-link">{label}</a>
                    </Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">Microservices</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    );
};
