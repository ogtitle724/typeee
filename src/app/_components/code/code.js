import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import styles from "./code.module.css";
import BtnCopy from "../btn/copy/copy";

export default function CodeBlock(props) {
  const regexLang = /(?<=(<pre><code\s+class="language-))\w+(?=")/;
  const regexCodeString = /(?<=<pre><code.*>).+(?=(<\/code><\/pre>))/s;
  const regexMDir = /(\*\-\-)(.*?)(\-\-\*)/g;
  const regexDir = /(?<=(\*\-\-))(.*?)(?=(\-\-\*))/g;

  //extract title
  let title = props.codeString.match(regexDir)
    ? props.codeString.match(regexDir)[0]
    : "";
  let content = props.codeString.replace(regexMDir, "");

  if (title) {
    content = content.replace("\n", "");
  }

  //extract lang
  let lang = content.match(regexLang)?.[0];
  if (lang === "plaintext") lang = "text";

  const str = content
    .match(regexCodeString)[0]
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

  return (
    <section className={styles.pre}>
      <div className={styles.header}>
        <span>{title || lang}</span>
        <BtnCopy text={str} color={"black"} />
      </div>
      <SyntaxHighlighter
        language={lang}
        style={atomOneDark}
        showLineNumbers={true}
      >
        {str}
      </SyntaxHighlighter>
    </section>
  );
}
