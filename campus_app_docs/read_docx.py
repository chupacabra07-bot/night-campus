import zipfile
import xml.etree.ElementTree as ET
import sys

def docx_to_text(path):
    try:
        with zipfile.ZipFile(path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            texts = []
            for node in tree.iter():
                if node.tag.endswith('}t'):
                    if node.text:
                        texts.append(node.text)
                elif node.tag.endswith('}p'):
                    texts.append('\n')
            return "".join(texts)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python read_docx.py <docx_path> <out_path>")
    else:
        content = docx_to_text(sys.argv[1])
        with open(sys.argv[2], 'w', encoding='utf-8') as f:
            f.write(content)
