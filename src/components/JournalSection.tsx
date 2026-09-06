import Link from 'next/link';
import Image from 'next/image';

interface PostProps {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  body: string;
  tags: string[];
  readTime: number;
  createdAt: Date;
}

export function JournalSection({ posts = [] }: { posts?: PostProps[] }) {
  const [featured, ...recent] = posts;

  return (
    <section className="section-dark" id="journal">
      <div className="section-header">
        <div>
          <div className="sec-label">The Journal</div>
          <h2 className="section-heading">Studio <em>Stories.</em></h2>
        </div>
        <Link href="/journal" className="view-all">View all →</Link>
      </div>

      <div className="journal-grid">
        {featured && (
          <Link href={`/journal/${featured.slug}`} className="journal-main reveal block group cursor-pointer text-inherit no-underline">
            <div className="journal-cover relative overflow-hidden">
              {featured.coverImage ? (
                <Image src={featured.coverImage} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div className="photo-dark" style={{ width: '100%', height: '100%' }}></div>
              )}
            </div>
            <div className="journal-content">
              <span className="tag">{featured.tags[0] || 'Studio'}</span>
              <h3 className="journal-title group-hover:text-terra transition-colors">{featured.title}</h3>
              <p className="journal-excerpt">{featured.body.slice(0, 160)}...</p>
              <div className="journal-meta">
                {new Date(featured.createdAt).toLocaleDateString()} · {featured.readTime} min read
              </div>
            </div>
          </Link>
        )}

        <div className="journal-sidebar">
          {recent.slice(0, 3).map((post) => (
            <Link href={`/journal/${post.slug}`} key={post.id} className="journal-side-item reveal group cursor-pointer text-inherit no-underline">
              <div className="side-thumb relative overflow-hidden">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="150px" />
                ) : (
                  <div className="photo-slate" style={{ width: '100%', height: '100%' }}></div>
                )}
              </div>
              <div>
                <span className="tag" style={{ fontSize: '7px', padding: '1px 6px', marginBottom: '6px' }}>{post.tags[0] || 'Art'}</span>
                <h4 className="side-title group-hover:text-terra transition-colors">{post.title}</h4>
                <div className="side-meta">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
