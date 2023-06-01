export const getTagsText = (tags) =>
  tags?.map((tag, i) => {
    const lastTag = tags?.slice(-1)[0] || "";
    if (lastTag !== tag) {
      return <span key={i + 1}>#{tag}, </span>;
    }
    return <span key={i + 1}>#{tag}</span>;
  });
