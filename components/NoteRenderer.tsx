import type { NoteBlock } from "@/content/library";

export function NoteRenderer({ blocks }: { blocks: NoteBlock[] }) {
  return blocks.map((block, index) => {
    const id = `section-${index}`;

    if (block.type === "prose") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          {block.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      );
    }

    if (block.type === "formula") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          <div className="formula-card">
            <span className="formula">{block.formula}</span>
            <p>{block.explanation}</p>
            {block.terms.map((term) => (
              <div className="formula-term" key={term.symbol}>
                <strong>{term.symbol}</strong><span>{term.meaning}</span><small>{term.unit}</small>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === "circuit") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          <p>{block.intro}</p>
          <div className="concept-diagram" aria-label={block.alt}>
            <div className="diagram-source"><span>+</span><strong>{block.voltage}</strong><span>−</span></div>
            <div className="diagram-wire wire-one"><span>conventional current</span></div>
            <div className="diagram-load"><small>LOAD</small><strong>{block.resistance}</strong></div>
            <div className="diagram-wire wire-two" />
            <div className="diagram-ground"><span>reference</span></div>
            <div className="diagram-reading"><small>Result</small><strong>{block.current}</strong><span>flows around the loop</span></div>
          </div>
          <p className="figure-caption">{block.caption}</p>
        </section>
      );
    }

    if (block.type === "table") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          <div className="table-wrap">
            <table>
              <thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>{block.rows.map((row) => <tr key={row.join("")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      );
    }

    if (block.type === "callout") {
      return (
        <aside className={`learning-callout callout-${block.tone}`} id={id} key={id}>
          <span aria-hidden="true">{block.tone === "warning" ? "!" : "i"}</span>
          <div><strong>{block.heading}</strong><p>{block.body}</p></div>
        </aside>
      );
    }

    if (block.type === "checklist") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          <ul className="learning-checklist">
            {block.items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
          </ul>
        </section>
      );
    }

    if (block.type === "code") {
      return (
        <section className="content-section" id={id} key={id}>
          <h2>{block.heading}</h2>
          <p>{block.intro}</p>
          <div className="code-block"><span>{block.language}</span><pre><code>{block.code}</code></pre></div>
        </section>
      );
    }

    return (
      <section className="content-section review-card" id={id} key={id}>
        <p className="section-kicker">Active recall</p>
        <h2>{block.heading}</h2>
        <ol>{block.prompts.map((prompt) => <li key={prompt.question}><strong>{prompt.question}</strong><p>{prompt.answer}</p></li>)}</ol>
      </section>
    );
  });
}
