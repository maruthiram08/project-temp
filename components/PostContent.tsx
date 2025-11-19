"use client"

interface ContentBlock {
  type: "text" | "image" | "youtube" | "url"
  content: string
}

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  let blocks: ContentBlock[] = []

  try {
    blocks = JSON.parse(content)
  } catch (e) {
    // Fallback for plain text content
    blocks = [{ type: "text", content }]
  }

  const renderYouTubeEmbed = (url: string) => {
    // Extract YouTube video ID from various URL formats
    let videoId = ""

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || ""
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
    }

    if (!videoId) return null

    return (
      <div className="aspect-video w-full">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <div
                key={index}
                className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            )

          case "image":
            return (
              <div key={index} className="my-6">
                <img
                  src={block.content}
                  alt="Post content"
                  className="rounded-lg w-full object-cover max-h-[500px]"
                />
              </div>
            )

          case "youtube":
            return (
              <div key={index} className="my-6">
                {renderYouTubeEmbed(block.content)}
              </div>
            )

          case "url":
            return (
              <div key={index} className="my-4">
                <a
                  href={block.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 underline break-all"
                >
                  {block.content}
                </a>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
