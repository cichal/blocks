/** @jsx jsx */
import React, { useState } from 'react'
import { jsx, Styled } from 'theme-ui'
import prettier from 'prettier/standalone'
import parserJS from 'prettier/parser-babylon'

import { useEditor } from './editor-context'
import InlineRender from './inline-render'

import { Clipboard, Check } from 'react-feather'
import { IconButton } from './ui'

const Wrap = props => (
  <div
    sx={{
      width: '60%',
      backgroundColor: 'white',
      height: 'calc(100vh - 41px)',
      overflow: 'scroll'
    }}
    {...props}
  />
)

function copyToClipboard(toCopy) {
  const el = document.createElement(`textarea`);
  el.value = toCopy;
  el.setAttribute(`readonly`, ``);
  el.style.position = `absolute`;
  el.style.left = `-9999px`;
  document.body.appendChild(el);
  el.select();
  document.execCommand(`copy`);
  document.body.removeChild(el);
}

const Copy = ({ toCopy }) => {
  const [hasCopied, setHasCopied] = useState(false);

  function copyToClipboardOnClick() {
    if (hasCopied) return;

    copyToClipboard(toCopy);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }

  return (
    <IconButton onClick={copyToClipboardOnClick}>
      {hasCopied ? (
        <>
          <Check sx={{ color: "green" }} aria-label="Copied" />
        </>
      ) : (
        <>
          <Clipboard aria-label="Copy" />
        </>
      )}
    </IconButton>
  );
};

export default ({ code, transformedCode, scope, theme }) => {
  const { mode } = useEditor()

  if (mode === 'code') {
    return (
      <Wrap>
        <Copy toCopy={prettier.format(code, {
          parser: 'babel',
          plugins: [parserJS]
        })} />
        <Styled.pre
          language="js"
          sx={{
            mt: 0,
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          {prettier.format(code, {
            parser: 'babel',
            plugins: [parserJS]
          })}
        </Styled.pre>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <InlineRender scope={scope} code={transformedCode} theme={theme} />
    </Wrap>
  )
}
