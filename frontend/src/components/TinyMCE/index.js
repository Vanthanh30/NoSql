// components/TinyMCE/index.jsx
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function TextEditor({ value, onChange }) {
    return (
        <Editor
            apiKey="tqbvbsvpkack6nwll1rk20nga5enaozagirz72hfoilwq876"
            value={value}
            onEditorChange={onChange} // QUAN TRỌNG: bind thay đổi
            init={{
                height: 280,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help',
                content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
}

export default TextEditor;