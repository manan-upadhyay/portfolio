import { motion } from 'framer-motion';
import VoiceSwitcher from './VoiceSwitcher';
import SoundControl from './SoundControl';

/**
 * Bottom-right control cluster — a fixed flex row that hosts the visitor-facing
 * controls. Layout contract: **[Voice switcher] · [Sound control]** (voice left,
 * sound right). The sound control (Phase 4) expands on hover; because the row is
 * normal flex flow, growing it naturally pushes the voice button left. The theme
 * toggle stays top-right (unchanged).
 */
const ControlCluster = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.6 }}
    className="fixed bottom-5 right-5 z-40 flex items-end gap-3"
  >
    <VoiceSwitcher />
    <SoundControl />
  </motion.div>
);

export default ControlCluster;
