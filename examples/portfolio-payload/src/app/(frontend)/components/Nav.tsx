import Link from 'next/link'

export function Nav() {
  return (
    <header className="nav">
      <Link className="nav__logo" href="/">
        Logo
      </Link>
      <nav className="nav__links" aria-label="Main navigation">
        <Link href="/about">About</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  )
}
