export const summarizer = (last_5_conversations) => {
  const summarizeTitle = (content) => {
    const match = content.match(/^([^.]*\.[^.]*\s*)/);
    return match ? match[0].trim() : content.slice(0, 150);
  };

  const summarize = (conversations) => {
    const combined = conversations
      .map((convo) =>
        convo.messages
          .map((msg) => {
            try {
              const parsed = JSON.parse(msg);
              return `${parsed.role.toUpperCase()}: ${parsed.content.trim()}`;
            } catch (e) {
              console.warn("Failed to parse:", msg);
              return null;
            }
          })
          .filter(Boolean)
          .join("\n")
      )
      .join("\n\n");

    const truncated = combined.slice(0, 1000).trim();
    const summaryTitle = summarizeTitle(truncated);
    return `${summaryTitle}\n\n${truncated}`;
  };

  return summarize(last_5_conversations);
};
