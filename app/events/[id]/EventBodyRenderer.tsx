'use client';

import React from 'react';

interface Props {
  body: string;
}

function parseLine(line: string): React.ReactNode {
  // Bold: **text**
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-bold text-slate-800">{p}</strong>
      : p
  );
}

export default function EventBodyRenderer({ body }: Props) {
  const lines = body.split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="list-none space-y-2 mb-5 ml-0">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 font-jakarta text-slate-600 text-sm leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
            <span>{parseLine(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    if (line.startsWith('## ')) {
      flushList();
      nodes.push(
        <h2 key={i} className="font-jakarta font-extrabold text-primary-600 text-xl mt-8 mb-3 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      nodes.push(
        <h3 key={i} className="font-jakarta font-bold text-slate-800 text-base mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      flushList();
      nodes.push(
        <blockquote key={i}
          className="border-l-4 border-amber-400 pl-4 py-2 my-4 bg-amber-50 rounded-r-xl"
        >
          <p className="font-jakarta text-sm text-amber-800 leading-relaxed italic">
            {parseLine(line.slice(2))}
          </p>
        </blockquote>
      );
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
    } else if (line === '') {
      flushList();
    } else {
      flushList();
      nodes.push(
        <p key={i} className="font-jakarta text-slate-600 text-sm leading-relaxed mb-4">
          {parseLine(line)}
        </p>
      );
    }
  });

  flushList();

  return <div className="prose-event">{nodes}</div>;
}
