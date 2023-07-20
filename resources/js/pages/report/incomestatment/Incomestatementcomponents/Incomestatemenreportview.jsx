import React, { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { jsPDF } from "jspdf";
import Weeklyreporttable from './Weeklyreporttable';
import Dailyreporttable from './Dailyreporttable';
import { Tooltip } from '@mui/material';
const components = {
    'Month': Weeklyreporttable,
    'Week': Dailyreporttable
}

export default function Incomestatemenreportview(props) {
    const toPrint = useRef()
    const [showToolBar, setShowToolBar] = useState(false)
    const Component = components[props?.component]

    const handlePrint = useReactToPrint({
        content: () => toPrint.current,
        documentTitle: `${props.reportData?.title}`,
        onAfterPrint: () => void (0)
    })
    const donwloadtoPDF = () => {
        var doc = new jsPDF('portrait', 'mm', 'a4');
        var elementHTML = document.querySelector(".toPrint");
        doc.html(elementHTML, {
            callback: function (doc) {
                doc.save(`${props.reportData?.title}`)
            },
            margin: [10, 10, 10, 10],
            autoPaging: 'report-page-break',
            x: 0,
            y: 0,
            width: 210,
            windowWidth: window.innerWidth,
        })
    }

    const handlePDFDownload = () => {
        var tohide = document.querySelector('.show-after-print')
        tohide.style.display = 'none'
        donwloadtoPDF()
        setTimeout(() => {
            tohide.style.display = 'flex'
        }, 100);
    }

    function handleEsc(event) {
        if (event.keyCode === 27) {
            props.closeReportView()
        }
    }


    useEffect(() => {
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);
    useEffect(() => {
        setTimeout(() => {
            var RSC = document.querySelector('#reportScrollContainer')
            RSC.addEventListener('scroll', () => {
                setShowToolBar(true)
            })
        }, 200);
    }, []);


    return <div ref={toPrint} className='toPrint mx-auto overflow-scroll hiddenscroll w-[1200px] h-full p-5 py-10 font-mono '>
        <h3 className=' text-gray-800 text-4xl w-full text-center'>
            INCOME STATEMENT 
        </h3>
       
        <h3 className=' text-gray-800  w-full text-center'>
            {props.reportData?.title} 
        </h3>
        <nav className='flex mx-auto w-full items-center gap-2 text-gray-800 text-base  text-center'>
            <span className=' text-red-500 font-medium'> Note:</span> <span>The current income statement doesn't account in discount made on product sales</span>.
        </nav>
        <Component reportData={props.reportData} />
        {props?.reportData && <div className='show-after-print  backdrop:blur-sm z-[100] !fixed bottom-5 right-5 w-max  flex items-center flex-col whitespace-nowrap gap-2 print:!hidden '>
            <Tooltip title='Save as PDF'  >
                <button onClick={() => handlePDFDownload()} className=' py-2 px-3  rounded-full bg-red-500 text-white aspect-square'>
                   sav
                </button>
            </Tooltip>

            <Tooltip title='Print'>
                <button onClick={() => handlePrint()} className=' py-2 px-3  rounded-full bg-red-500 text-white aspect-square'>
                   pri
                </button>

            </Tooltip>
            <Tooltip title='Close View'>
                <button onClick={() => props?.closeReportView()} className=' py-2 px-3  rounded-full bg-red-500 text-white aspect-square'>
                    clo
                </button>
            </Tooltip>

        </div>}
    </div>
}
