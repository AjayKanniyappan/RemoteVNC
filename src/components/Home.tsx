import Link from 'next/link';

function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold py-6">Remote VNC</h1>
          <Link className="btn btn-info" href="/control">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
