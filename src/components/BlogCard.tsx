import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags?: string[];
  authorName?: string | null;
  readTime?: number;
  createdAt: string | Date;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <Link href={`/blog/${post.slug}`} className="block group card-hover">
      <div className="relative product-image-wrap aspect-[16/10] rounded-2xl overflow-hidden mb-6 luxury-border">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full bg-gold text-ink text-xs font-bold">
            {post.category}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-xs text-cream/50">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {dateStr}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} دقیقه مطالعه
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-cream/60 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
          {post.authorName && (
            <span className="text-xs text-cream/50">{post.authorName}</span>
          )}
          <span className="flex items-center gap-1 text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity">
            مطالعه مقاله
            <ArrowLeft className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
