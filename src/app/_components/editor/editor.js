"use client";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
import fetchIns from "@/lib/fetch";
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
    // (2)
    return {
      async upload() {
        const formData = new FormData();

        try {
          const file = await loader.file;
          formData.append("name", file.name);
          formData.append("file", file);

          const res = await fetchIns.post(
            process.env.NEXT_PUBLIC_PATH_CK_UPLOAD,
            formData,
            { next: { revalidate: 0 } }
          );
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
    // (3)
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
