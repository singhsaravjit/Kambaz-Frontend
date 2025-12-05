import Link from "next/link";

export default function Labs() {
  return (
    <div>
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/Labs/Lab1" id="wd-lab1-link">
            Lab 1: HTML Examples </Link>
        </li>
        <li>
          <Link href="/Labs/Lab2" id="wd-lab2-link">
            Lab 2: CSS Basics </Link>
        </li>
        <li>
          <Link href="/Labs/Lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals </Link>
        </li>
        <li>
          <Link href="/Labs/Lab4" id="wd-lab4-link">
            Lab 4: Maintaining State in React Applications </Link>
        </li>
        <li>
          <Link href="/">Kambaz</Link>
        </li>
        <li>
          <Link href="https://kambaz-node-server-app-v8ps.onrender.com/">Server</Link>
        </li>
      </ul>
      Github: <Link id="wd-github" href="https://github.com/singhsaravjit/kambaz-next-js-cs5610-fa25-05">Click Here</Link> to get the React code!
      <br />
       Github: <Link id="wd-github" href="https://github.com/singhsaravjit/kambaz-node-server-app">Click Here</Link> to get the Server code!
    </div>
  );
} 