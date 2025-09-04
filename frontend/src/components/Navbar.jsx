export default function Navbar({ rightSlot=null }){
  return (
    <nav className="nav">
      <div className="nav__brand">Hábitos & Rachas</div>
      <div className="nav__spacer" />
      {rightSlot}
    </nav>
  )
}
