import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import IconifyIcon from "../../../components/ui/IconifyIcon";
import Button from "../../../components/inputs/Button";

const fileTypes = ["xlsx", "xls"];


/**
 * 
 * @param {{
 *  getFile: (f:File | null)=>void,
 *  handleUpload: ()=> void
 *  }}  
 * @returns 
 */
function ExcelUploadForm({ getFile,handleUpload }) {
    const [file, setFile] = useState(null);

    const handleChange = (file) => {
        setFile(file);
    };

    useEffect(() => {
        getFile(file)
    }, [file])


    return (
        <div className=" p-5 flex flex-col gap-3 mx-auto h-52 items-center">
            {file?.name &&
                <div
                    style={{
                        border: '2px dashed #007bff',
                        padding: '20px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#f9f9f9'
                    }}
                    className="flex w-full flex-col gap-3">
                    <IconifyIcon icon="vscode-icons:file-type-excel2" fontSize="12rem" className="!h-12 mx-auto !w-12" />
                    <span>
                        {file.name}
                    </span>
                </div>

            }
            {!file?.name && <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
            >
                <div className="flex w-full flex-col gap-3 min-w-full"
                    style={{
                        border: '2px dashed #007bff',
                        padding: '20px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <IconifyIcon icon="ri:upload-cloud-line" fontSize="12rem" className="!h-12 mx-auto !w-12" />
                    <p>Drag and drop template file here, or click to select file</p>
                </div>
            </FileUploader>
            }
            {file?.name && <>
                <nav className="flex items-center gap-4">
                    <Button onClick={() => setFile(null)} danger className="" >
                        Change File
                    </Button>
                    <Button onClick={handleUpload} info className="" >
                        Upload File
                    </Button>
                </nav>
            </>}

        </div>
    )
}

export default ExcelUploadForm