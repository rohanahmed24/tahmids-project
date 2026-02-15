"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    MapPin,
    Clock,
    ChevronDown,
    ArrowRight,
    Sparkles,
    Users,
    Heart,
    Zap,
    Globe,
    X
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
// import { submitJobApplication } from "@/actions/careers";

const DEPARTMENT_KEYS = ["All", "Engineering", "Design", "Content", "Marketing", "Operations"] as const;

const jobs = [
    {
        id: 1,
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "We're looking for a passionate frontend engineer to help build beautiful, performant interfaces that millions of readers will love.",
        responsibilities: [
            "Build and maintain our Next.js web application",
            "Collaborate with designers to implement pixel-perfect UIs",
            "Optimize performance and accessibility",
            "Mentor junior developers",
        ],
        requirements: [
            "5+ years of frontend development experience",
            "Expert knowledge of React, TypeScript, and CSS",
            "Experience with Next.js and server-side rendering",
            "Strong eye for design and attention to detail",
        ],
    },
    {
        id: 2,
        title: "Product Designer",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        description: "Join our design team to create intuitive, beautiful experiences that help readers discover and engage with meaningful content.",
        responsibilities: [
            "Design user interfaces for web and mobile",
            "Conduct user research and usability testing",
            "Create and maintain our design system",
            "Collaborate closely with engineering",
        ],
        requirements: [
            "4+ years of product design experience",
            "Strong portfolio demonstrating UI/UX skills",
            "Proficiency in Figma",
            "Experience with design systems",
        ],
    },
    {
        id: 3,
        title: "Senior Content Strategist",
        department: "Content",
        location: "Remote",
        type: "Full-time",
        description: "Shape the voice and content strategy of Wisdomia as we grow into the leading platform for thoughtful, meaningful stories.",
        responsibilities: [
            "Develop content strategy and editorial guidelines",
            "Work with writers to craft compelling narratives",
            "Analyze content performance and optimize",
            "Build relationships with thought leaders",
        ],
        requirements: [
            "6+ years in content strategy or editorial",
            "Exceptional writing and editing skills",
            "Experience with SEO and content analytics",
            "Passion for philosophy, design, and culture",
        ],
    },
    {
        id: 4,
        title: "Growth Marketing Manager",
        department: "Marketing",
        location: "San Francisco, CA",
        type: "Full-time",
        description: "Drive user acquisition and engagement through creative marketing strategies that resonate with our audience of curious minds.",
        responsibilities: [
            "Develop and execute growth marketing campaigns",
            "Manage paid advertising across channels",
            "Optimize conversion funnels",
            "Track and report on key metrics",
        ],
        requirements: [
            "4+ years in growth or performance marketing",
            "Experience with digital advertising platforms",
            "Strong analytical skills",
            "Creative mindset with data-driven approach",
        ],
    },
    {
        id: 5,
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "Build scalable, reliable infrastructure to power our growing platform of readers and creators.",
        responsibilities: [
            "Design and implement APIs and services",
            "Optimize database performance",
            "Ensure system reliability and security",
            "Participate in architecture decisions",
        ],
        requirements: [
            "4+ years of backend development",
            "Experience with Node.js, Python, or Go",
            "Strong database skills (SQL and NoSQL)",
            "Knowledge of cloud platforms (AWS/GCP)",
        ],
    },
];
type JobItem = (typeof jobs)[number];

const jobsBn: JobItem[] = [
    {
        id: 1,
        title: "সিনিয়র ফ্রন্টএন্ড ইঞ্জিনিয়ার",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "আমরা এমন একজন ফ্রন্টএন্ড ইঞ্জিনিয়ার খুঁজছি যিনি সুন্দর ও দ্রুত ইন্টারফেস তৈরি করতে আগ্রহী।",
        responsibilities: [
            "আমাদের Next.js ওয়েব অ্যাপ তৈরি ও রক্ষণাবেক্ষণ করা",
            "ডিজাইনারদের সাথে কাজ করে পিক্সেল-নিখুঁত UI তৈরি করা",
            "পারফরম্যান্স ও অ্যাক্সেসিবিলিটি উন্নত করা",
            "জুনিয়র ডেভেলপারদের মেন্টর করা",
        ],
        requirements: [
            "ফ্রন্টএন্ড ডেভেলপমেন্টে ৫+ বছরের অভিজ্ঞতা",
            "React, TypeScript এবং CSS-এ দৃঢ় দক্ষতা",
            "Next.js ও SSR নিয়ে কাজের অভিজ্ঞতা",
            "ডিজাইনে সূক্ষ্ম নজর ও বিস্তারিত মনোযোগ",
        ],
    },
    {
        id: 2,
        title: "প্রোডাক্ট ডিজাইনার",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        description: "পাঠকদের অর্থপূর্ণ কনটেন্ট আবিষ্কারে সহায়ক সুন্দর ও সহজ অভিজ্ঞতা ডিজাইন করতে আমাদের সাথে যোগ দিন।",
        responsibilities: [
            "ওয়েব ও মোবাইলের জন্য UI ডিজাইন করা",
            "ইউজার রিসার্চ ও ইউজেবিলিটি টেস্ট করা",
            "ডিজাইন সিস্টেম তৈরি ও রক্ষণাবেক্ষণ করা",
            "ইঞ্জিনিয়ারিং টিমের সাথে ঘনিষ্ঠভাবে কাজ করা",
        ],
        requirements: [
            "প্রোডাক্ট ডিজাইনে ৪+ বছরের অভিজ্ঞতা",
            "UI/UX দক্ষতা প্রদর্শনকারী শক্তিশালী পোর্টফোলিও",
            "Figma-তে দক্ষতা",
            "ডিজাইন সিস্টেমে কাজের অভিজ্ঞতা",
        ],
    },
    {
        id: 3,
        title: "সিনিয়র কনটেন্ট স্ট্র্যাটেজিস্ট",
        department: "Content",
        location: "Remote",
        type: "Full-time",
        description: "Wisdomia-র কনটেন্ট ভয়েস ও কৌশল গঠনে নেতৃত্ব দিন।",
        responsibilities: [
            "কনটেন্ট স্ট্র্যাটেজি ও এডিটোরিয়াল গাইডলাইন তৈরি করা",
            "লেখকদের সাথে কাজ করে শক্তিশালী বর্ণনা তৈরি করা",
            "কনটেন্ট পারফরম্যান্স বিশ্লেষণ ও অপ্টিমাইজ করা",
            "থট-লিডারদের সাথে সম্পর্ক তৈরি করা",
        ],
        requirements: [
            "কনটেন্ট স্ট্র্যাটেজি/এডিটোরিয়ালে ৬+ বছরের অভিজ্ঞতা",
            "চমৎকার লেখা ও সম্পাদনা দক্ষতা",
            "SEO ও কনটেন্ট অ্যানালিটিক্সে অভিজ্ঞতা",
            "দর্শন, ডিজাইন ও সংস্কৃতিতে আগ্রহ",
        ],
    },
    {
        id: 4,
        title: "গ্রোথ মার্কেটিং ম্যানেজার",
        department: "Marketing",
        location: "San Francisco, CA",
        type: "Full-time",
        description: "সৃজনশীল মার্কেটিং কৌশলের মাধ্যমে ইউজার গ্রোথ ও এনগেজমেন্ট বাড়াতে আমাদের সাথে কাজ করুন।",
        responsibilities: [
            "গ্রোথ মার্কেটিং ক্যাম্পেইন পরিকল্পনা ও বাস্তবায়ন করা",
            "বিভিন্ন চ্যানেলে পেইড বিজ্ঞাপন পরিচালনা করা",
            "কনভার্সন ফানেল অপ্টিমাইজ করা",
            "কী মেট্রিকস ট্র্যাক ও রিপোর্ট করা",
        ],
        requirements: [
            "গ্রোথ/পারফরম্যান্স মার্কেটিংয়ে ৪+ বছরের অভিজ্ঞতা",
            "ডিজিটাল বিজ্ঞাপন প্ল্যাটফর্মে অভিজ্ঞতা",
            "শক্তিশালী বিশ্লেষণ দক্ষতা",
            "ডেটা-চালিত সৃজনশীল মানসিকতা",
        ],
    },
    {
        id: 5,
        title: "ব্যাকএন্ড ইঞ্জিনিয়ার",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "পাঠক ও ক্রিয়েটরদের জন্য স্কেলযোগ্য ও নির্ভরযোগ্য অবকাঠামো গড়ে তুলুন।",
        responsibilities: [
            "API ও সার্ভিস ডিজাইন এবং বাস্তবায়ন করা",
            "ডাটাবেস পারফরম্যান্স উন্নত করা",
            "সিস্টেমের নির্ভরযোগ্যতা ও নিরাপত্তা নিশ্চিত করা",
            "আর্কিটেকচার সিদ্ধান্তে অংশগ্রহণ করা",
        ],
        requirements: [
            "ব্যাকএন্ড ডেভেলপমেন্টে ৪+ বছরের অভিজ্ঞতা",
            "Node.js, Python বা Go-তে অভিজ্ঞতা",
            "SQL ও NoSQL ডাটাবেসে দক্ষতা",
            "AWS/GCP-এর মতো ক্লাউড প্ল্যাটফর্মে জ্ঞান",
        ],
    },
];

const valuesEn = [
    {
        icon: Heart,
        title: "Purpose-Driven",
        description: "Every story we share has the power to change perspectives and inspire action.",
    },
    {
        icon: Users,
        title: "Collaborative",
        description: "We believe the best ideas emerge when diverse minds work together.",
    },
    {
        icon: Zap,
        title: "Innovative",
        description: "We constantly push boundaries to create better reading experiences.",
    },
    {
        icon: Globe,
        title: "Global Mindset",
        description: "Our remote-first culture embraces talent from around the world.",
    },
];

const valuesBn = [
    {
        icon: Heart,
        title: "উদ্দেশ্যনির্ভর",
        description: "আমাদের প্রতিটি গল্প দৃষ্টিভঙ্গি বদলাতে এবং অনুপ্রেরণা দিতে পারে।",
    },
    {
        icon: Users,
        title: "সহযোগিতামূলক",
        description: "বৈচিত্র্যময় দল একসাথে কাজ করলেই সেরা ধারণা তৈরি হয়।",
    },
    {
        icon: Zap,
        title: "উদ্ভাবনী",
        description: "আরও ভালো পাঠ-অভিজ্ঞতা দিতে আমরা নতুন সীমা ছুঁতে চাই।",
    },
    {
        icon: Globe,
        title: "গ্লোবাল মানসিকতা",
        description: "আমাদের রিমোট-ফার্স্ট সংস্কৃতি বিশ্বজুড়ে প্রতিভাকে স্বাগত জানায়।",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

export default function CareersPage() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            hiring: "আমরা নিয়োগ দিচ্ছি",
            joinOur: "আমাদের",
            mission: "মিশনে যোগ দিন",
            heroBody: "ভাবনাশীল গল্প বলার ভবিষ্যৎ গড়তে আমাদের সাথে কাজ করুন।",
            ourValues: "আমাদের",
            values: "মূল্যবোধ",
            valuesBody: "Wisdomia-তে আমরা এই নীতিগুলো অনুসরণ করি।",
            open: "খোলা",
            positions: "পজিশন",
            rolesAvailable: "টি পদ খালি আছে",
            role: "পদ",
            responsibilities: "দায়িত্বসমূহ",
            requirements: "যোগ্যতা",
            applyNow: "এখনই আবেদন করুন",
            applyFor: "আবেদন করুন",
            fullName: "পূর্ণ নাম",
            email: "ইমেইল",
            linkedin: "লিংকডইন প্রোফাইল",
            resume: "রিজিউম / সিভি",
            resumeHint: "PDF বা Word ডকুমেন্ট (সর্বোচ্চ 5MB)",
            whyJoin: "কেন যোগ দিতে চান?",
            aboutYou: "আপনার সম্পর্কে বলুন...",
            submitting: "পাঠানো হচ্ছে...",
            submitApplication: "আবেদন জমা দিন",
            submitted: "আবেদন জমা হয়েছে!",
            submittedBodyPrefix: "আপনার আগ্রহের জন্য ধন্যবাদ",
            submittedBodySuffix: "আমরা দ্রুত যোগাযোগ করব।",
            close: "বন্ধ করুন",
            all: "সব",
            engineering: "ইঞ্জিনিয়ারিং",
            design: "ডিজাইন",
            content: "কনটেন্ট",
            marketing: "মার্কেটিং",
            operations: "অপারেশনস",
            fullTime: "ফুল-টাইম",
            remote: "রিমোট",
            somethingWrong: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
            applicationReceived: "আবেদন গ্রহণ করা হয়েছে",
        }
        : {
            hiring: "We're Hiring",
            joinOur: "Join Our",
            mission: "Mission",
            heroBody: "Help us build the future of thoughtful storytelling. We're looking for passionate individuals who want to make a meaningful impact.",
            ourValues: "Our",
            values: "Values",
            valuesBody: "These principles guide everything we do at Wisdomia.",
            open: "Open",
            positions: "Positions",
            rolesAvailable: "roles available",
            role: "role",
            responsibilities: "Responsibilities",
            requirements: "Requirements",
            applyNow: "Apply Now",
            applyFor: "Apply for",
            fullName: "Full Name",
            email: "Email",
            linkedin: "LinkedIn Profile",
            resume: "Resume / CV",
            resumeHint: "PDF or Word documents (Max 5MB)",
            whyJoin: "Why do you want to join?",
            aboutYou: "Tell us about yourself...",
            submitting: "Submitting...",
            submitApplication: "Submit Application",
            submitted: "Application Submitted!",
            submittedBodyPrefix: "Thank you for your interest in",
            submittedBodySuffix: "We'll be in touch soon.",
            close: "Close",
            all: "All",
            engineering: "Engineering",
            design: "Design",
            content: "Content",
            marketing: "Marketing",
            operations: "Operations",
            fullTime: "Full-time",
            remote: "Remote",
            somethingWrong: "Something went wrong. Please try again.",
            applicationReceived: "Application received",
        };

    const departmentLabels = {
        All: copy.all,
        Engineering: copy.engineering,
        Design: copy.design,
        Content: copy.content,
        Marketing: copy.marketing,
        Operations: copy.operations,
    } as const;

    const values = locale === "bn" ? valuesBn : valuesEn;
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [expandedJob, setExpandedJob] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const localizedJobs = locale === "bn" ? jobsBn : jobs;
    const filteredJobs = selectedDepartment === "All"
        ? localizedJobs
        : localizedJobs.filter(job => job.department === selectedDepartment);

    const handleApply = (job: JobItem) => {
        setSelectedJob(job);
        setIsModalOpen(true);
        setIsSubmitted(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        if (selectedJob) {
            formData.append("jobId", selectedJob.id.toString());
            formData.append("jobTitle", selectedJob.title);
        }

        try {
            // Simulated submission (Server action removed)
            await new Promise(resolve => setTimeout(resolve, 1500));
            const result = { success: true, message: copy.applicationReceived };

            if (result.success) {
                setIsSubmitted(true);
                form.reset();
            } else {
                setError(result.message);
            }
        } catch {
            setError(copy.somethingWrong);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">
                            {copy.hiring}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6"
                    >
                        {copy.joinOur} <span className="italic text-accent">{copy.mission}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto"
                    >
                        {copy.heroBody}
                    </motion.p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-bg-secondary">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                            {copy.ourValues} <span className="italic">{copy.values}</span>
                        </h2>
                        <p className="text-text-secondary max-w-xl mx-auto">
                            {copy.valuesBody}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {values.map((value) => (
                            <motion.div
                                key={value.title}
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-bg-primary border border-border-subtle rounded-2xl p-6 text-center"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <value.icon className="w-7 h-7 text-accent" />
                                </motion.div>
                                <h3 className="font-serif font-bold text-lg mb-2">{value.title}</h3>
                                <p className="text-sm text-text-secondary">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                            {copy.open} <span className="italic">{copy.positions}</span>
                        </h2>
                        <p className="text-text-secondary">
                            {filteredJobs.length} {filteredJobs.length !== 1 ? copy.rolesAvailable : copy.role}
                        </p>
                    </motion.div>

                    {/* Department Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-2 mb-12"
                    >
                        {DEPARTMENT_KEYS.map((dept) => (
                            <motion.button
                                key={dept}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedDepartment === dept
                                    ? "bg-accent text-white"
                                    : "bg-bg-secondary border border-border-subtle hover:border-accent"
                                    }`}
                            >
                                {departmentLabels[dept]}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Job Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    layout
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden"
                                >
                                    {/* Job Header */}
                                    <button
                                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                        className="w-full p-6 flex items-center justify-between text-left hover:bg-bg-primary/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-xl font-serif font-bold mb-2">{job.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    {departmentLabels[job.department as keyof typeof departmentLabels] ?? job.department}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location === "Remote" ? copy.remote : job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {job.type === "Full-time" ? copy.fullTime : job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedJob === job.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-6 h-6 text-text-muted" />
                                        </motion.div>
                                    </button>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {expandedJob === job.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 border-t border-border-subtle pt-6">
                                                    <p className="text-text-secondary mb-6">{job.description}</p>

                                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <h4 className="font-bold mb-3">{copy.responsibilities}</h4>
                                                            <ul className="space-y-2">
                                                                {job.responsibilities.map((item, i) => (
                                                                    <motion.li
                                                                        key={i}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: i * 0.1 }}
                                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                                    >
                                                                        <span className="text-accent mt-1">•</span>
                                                                        {item}
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold mb-3">{copy.requirements}</h4>
                                                            <ul className="space-y-2">
                                                                {job.requirements.map((item, i) => (
                                                                    <motion.li
                                                                        key={i}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: i * 0.1 }}
                                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                                    >
                                                                        <span className="text-accent mt-1">•</span>
                                                                        {item}
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleApply(job)}
                                                        className="w-full md:w-auto px-8 py-3 bg-accent text-white font-bold text-sm uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
                                                    >
                                                        {copy.applyNow}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Application Modal */}
            <AnimatePresence>
                {isModalOpen && selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-primary border border-border-subtle rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        >
                            {!isSubmitted ? (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold">{copy.applyFor}</h3>
                                            <p className="text-accent font-medium">{selectedJob.title}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{copy.fullName}</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">{copy.email}</label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">{copy.linkedin}</label>
                                            <input
                                                name="linkedin"
                                                type="url"
                                                className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                                placeholder="https://linkedin.com/in/johndoe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">{copy.resume}</label>
                                            <div className="relative">
                                                <input
                                                    name="resume"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    required
                                                    className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                                                />
                                            </div>
                                            <p className="text-xs text-text-secondary mt-1">{copy.resumeHint}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">{copy.whyJoin}</label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors resize-none"
                                                placeholder={copy.aboutYou}
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 bg-accent text-white font-bold text-sm uppercase tracking-widest rounded-full hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? copy.submitting : copy.submitApplication}
                                        </motion.button>
                                    </form>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Sparkles className="w-10 h-10 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-serif font-bold mb-2">{copy.submitted}</h3>
                                    <p className="text-text-secondary mb-6">
                                        {copy.submittedBodyPrefix} {selectedJob.title}. {copy.submittedBodySuffix}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-3 bg-bg-secondary border border-border-subtle rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all"
                                    >
                                        {copy.close}
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
