import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTelegramPlane, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <div className="bg-[#0a0a23] text-white pt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="hover:text-orange-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-orange-400">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-orange-400">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-orange-400">Terms & Conditions</Link></li>
            <li><Link href="#" className="hover:text-orange-400">FAQs & Help</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3"><FaMapMarkerAlt /> Addis Ababa, Ethiopia</li>
            <li className="flex items-center gap-3"><FaPhoneAlt /> +251-912-345-678</li>
            <li className="flex items-center gap-3"><FaEnvelope /> info@eduassist.com</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-5 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400"><FaFacebookF /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400"><FaInstagram /></a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400"><FaTelegramPlane /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 py-6 border-t border-gray-700 px-6">
        &copy; {new Date().getFullYear()} Edu Assist. All Rights Reserved.
      </div>
    </div>
  );
}
