import { motion } from "framer-motion"

export default function Addmotion(props) {
    return <motion.div className={`h-full ${props?.className}`}
        initial={{ y:40, opacity: 0.5 }}
        animate={{ y:0, opacity: 1 }}
        exit={{ opacity: 0,scale:0.2,  transition: { duration: 0.2 } }}
        transition={{
            type: "spring",
            stiffness: 360,
            damping: 20
        }}
    >
        {props.children}
    </motion.div>
}
