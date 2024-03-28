import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import styles from "./code.module.css";
import BtnCopy from "../btn/copy/copy";

export default function CodeBlock(props) {
  const regexLang = /(?<=(<pre><code\s+class="language-))\w+(?=")/;
  const regexCodeString = /(?<=<pre><code.*>).+(?=(<\/code><\/pre>))/s;
  let lang = props.codeString.match(regexLang)[0];

  if (lang === "plaintext") lang = "text";

  const str = props.codeString
    .match(regexCodeString)[0]
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

  return (
    <section className={styles.code}>
      <div className={styles.code_header}>
        <span>{lang}</span>
        <BtnCopy text={str} color={"black"} />
      </div>
      <SyntaxHighlighter
        language={lang}
        style={tomorrowNight}
        showLineNumbers={true}
      >
        {str}
      </SyntaxHighlighter>
    </section>
  );
}
