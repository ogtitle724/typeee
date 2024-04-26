"use client";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./style.css";

export default function Editor({
  ckRef,
  data,
  config,
  onReady,
  onChange,
  onBlur,
  onFocus,
}) {
  const customUploadAdapter = (loader) => {
    return {
      async upload() {
        console.log("upload image");
        const formData = new FormData();

        try {
          const file = await loader.file;
          formData.append("name", file.name);
          formData.append("file", file);

          const res = await fetch(process.env.NEXT_PUBLIC_PATH_CK_UPLOAD, {
            method: "POST",
            body: formData,
          });
          const body = await res.json();

          return {
            default: body.src,
          };
        } catch (err) {
          return err;
        }
      },
      async abort() {},
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      ref={ckRef}
      editor={ClassicEditor}
      data={data}
      config={{
        ...config,
        extraPlugins: [uploadPlugin],
        mediaEmbed: {
          previewsInData: true,
        },
      }}
      onReady={onReady}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
