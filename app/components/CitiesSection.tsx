"use client";

import React from "react";
import Image from "next/image";

export function CitiesSection() {
    const cities = [
        { name: "Los Angeles, CA", image: "/la.jpg" },
        { name: "New York, NY", image: "/ny.jpg" },
        { name: "Chicago, IL", image: "/chicago.jpg" },
        { name: "Houston, TX", image: "/houston.jpg" },
        { name: "Miami, FL", image: "/miami.jpg" },
        { name: "Seattle, WA", image: "/seattle.jpg" },
    ];

    return (
        <section
            className="relative w-full bg-[#F9F9F9] flex justify-center items-start"
            style={{ minHeight: "958px" }}
        >
            {/* Inner div */}
            <div
                className="bg-[#F9F9F9] mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-0 relative"
                style={{
                    minHeight: "753.52px",
                    marginTop: "68px",
                }}
                >
                {/* Heading */}
                <h2
                    className="text-center font-bold px-4 relative"
                    style={{
                    fontFamily: "Jost",
                    fontSize: "clamp(24px, 5vw, 32px)",
                    lineHeight: "1.2",
                    color: "#2B2B2B",
                    marginTop: "20px",
                    }}
                >
                    Explore Listings By{" "}
                    <span className="relative inline-block" style={{ color: "#C71F37" }}>
                    Cities
                    <Image
                        src="/herbs-BCkTGihn.svg fill.png"
                        alt="herb icon"
                        className="absolute -top-1 -right-4 sm:-top-1.5 sm:-right-5.5 md:-top-3 md:-right-6.5 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-80"
                        width={40}
                        height={40}
                        style={{
                        transform: "rotate(-7deg)",
                        }}
                    />
                    </span>
                </h2>

                {/* description */}
                <div className="flex justify-center mt-4 px-4">
                    <p
                        className="max-w-[554px] w-full"
                        style={{
                            fontFamily: "Inter",
                            fontWeight: 400,
                            fontSize: "clamp(16px, 4vw, 18px)",
                            lineHeight: "1.56",
                            color: "#707070",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Our clients love our services and give great &amp; positive reviews
                    </p>
                </div>

                {/* custom grid */}
                <div className="relative mt-8 hidden lg:grid lg:grid-cols-[636px_306px_306px] gap-4">

                    <div className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "636px", height: "300px" }}>
                        <img
                            src="/New York.png"
                            alt="New York, NY"
                            className="w-full h-full object-cover"
                        />
                        {/* overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        ></div>

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "217.2px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            New York
                        </h3>

                        {/* overlay+border pill 1 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "252px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26", // 15% white overlay
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        {/* overlay+border pill 2 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "252px",
                                left: "104px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26", // 15% white overlay
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                New York
                            </span>
                        </div>

                        {/* overlay+border pill 3 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "252px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26", // 15% white overlay
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Mexico City
                            </span>
                        </div>

                        {/* overlay+border pill 4 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "63.77px",
                                height: "30px",
                                top: "252px",
                                left: "274px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26", // 15% white overlay
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>


                    </div>

                    {/* second small card */}
                    <div
                        className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "306px", height: "300px" }}
                    >
                        <img
                            src="/Los Angeles.png"
                            alt="Los Angeles, CA"
                            className="w-full h-full object-cover"
                        />

                        {/* dark overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "179.48px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Los Angeles
                        </h3>

                        {/* overlay+border pill 1 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "216.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        {/* overlay+border pill 2 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "216.48px",
                                left: "104.98px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                New York
                            </span>
                        </div>

                        {/* overlay+border pill 3 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "216.98px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Mexico City
                            </span>
                        </div>

                        {/* overlay+border pill 4 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "78px",
                                height: "30px",
                                top: "254.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>
                    </div>


                    {/* third small card */}
                    {/* Mexico City Card */}
                    <div
                        className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "306px", height: "300px" }}
                    >
                        <img
                            src="/Mexico City.png"
                            alt="Mexico City"
                            className="w-full h-full object-cover"
                        />

                        {/* dark overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "179.48px", // adjust if needed
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Mexico City
                        </h3>

                        {/* overlay+border pill 1 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "216.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        {/* overlay+border pill 2 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "216.48px",
                                left: "104.98px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                New York
                            </span>
                        </div>

                        {/* overlay+border pill 3 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "216.98px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Mexico City
                            </span>
                        </div>

                        {/* overlay+border pill 4 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "78px",
                                height: "30px",
                                top: "254.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>
                    </div>

                </div>

                {/* second row (repeat same pattern or adjust as needed) */}
                <div className="mt-4 hidden lg:grid lg:grid-cols-[306px_306px_636px] gap-4">
                    {/* Toronto Card */}
                    <div
                        className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "306px", height: "300px" }}
                    >
                        <img
                            src="/Toronto.jpg"
                            alt="Toronto, TO"
                            className="w-full h-full object-cover"
                        />

                        {/* dark overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "179.48px", // adjust if needed
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Toronto
                        </h3>

                        {/* overlay+border pill 1 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "216.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        {/* overlay+border pill 2 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "216.48px",
                                left: "104.98px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                New York
                            </span>
                        </div>

                        {/* overlay+border pill 3 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "216.98px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>

                        {/* overlay+border pill 4 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "78px",
                                height: "30px",
                                top: "254.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>
                    </div>

                    {/* second small card */}
                    <div
                        className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "306px", height: "300px" }}
                    >
                        <img
                            src="/Montreal.png"
                            alt="Montreal, MO"
                            className="w-full h-full object-cover"
                        />

                        {/* dark overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "179.48px", // adjust if needed
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Montreal
                        </h3>

                        {/* overlay+border pill 1 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "216.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        {/* overlay+border pill 2 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "216.48px",
                                left: "104.98px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                New York
                            </span>
                        </div>

                        {/* overlay+border pill 3 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "216.98px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>

                        {/* overlay+border pill 4 */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "78px",
                                height: "30px",
                                top: "254.48px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Toronto
                            </span>
                        </div>
                    </div>
                    <div
                        className="relative rounded-[16px] overflow-hidden shadow"
                        style={{ width: "636px", height: "300px" }}
                    >
                        <img
                            src="/Chicago.png"
                            alt="Chicago, CG"
                            className="w-full h-full object-cover"
                        />

                        {/* dark overlay */}
                        <div
                            className="absolute inset-0"
                            style={{ backgroundColor: "#020D16", opacity: 0.3 }}
                        />

                        {/* main heading */}
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "24px",
                                lineHeight: "28.8px",
                                color: "#F7F7F7",
                                top: "217.2px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Chicago
                        </h3>

                        {/* pills */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "80.98px",
                                height: "30px",
                                top: "252px",
                                left: "16px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Jost",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "12px",
                                    color: "#FFFFFF",
                                }}
                            >
                                Los Angeles
                            </span>
                        </div>

                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76.95px",
                                height: "30px",
                                top: "252px",
                                left: "104px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span style={{ fontFamily: "Jost", fontWeight: 500, fontSize: "12px", color: "#FFFFFF" }}>
                                New York
                            </span>
                        </div>

                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "76px",
                                height: "30px",
                                top: "252px",
                                left: "190px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span style={{ fontFamily: "Jost", fontWeight: 500, fontSize: "12px", color: "#FFFFFF" }}>
                                Mexico City
                            </span>
                        </div>

                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                width: "63.77px",
                                height: "30px",
                                top: "252px",
                                left: "274px",
                                borderRadius: "800px",
                                border: "1px solid #FFFFFF2E",
                                backgroundColor: "#FFFFFF26",
                            }}
                        >
                            <span style={{ fontFamily: "Jost", fontWeight: 500, fontSize: "12px", color: "#FFFFFF" }}>
                                Toronto
                            </span>
                        </div>
                    </div>

                </div>

                {/* Mobile responsive grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                    {/* New York - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px]">
                        <img
                            src="/New York.png"
                            alt="New York, NY"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        ></div>
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            New York
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Los Angeles
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    New York
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Los Angeles - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px]">
                        <img
                            src="/Los Angeles.png"
                            alt="Los Angeles, CA"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Los Angeles
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Los Angeles
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    New York
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mexico City - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px]">
                        <img
                            src="/Mexico City.png"
                            alt="Mexico City"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Mexico City
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Mexico City
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Toronto
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Toronto - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px]">
                        <img
                            src="/Toronto.jpg"
                            alt="Toronto, TO"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Toronto
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Toronto
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Montreal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Montreal - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px]">
                        <img
                            src="/Montreal.png"
                            alt="Montreal, MO"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: "#020D16",
                                opacity: 0.3,
                            }}
                        />
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Montreal
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Montreal
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Chicago
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chicago - Mobile */}
                    <div className="relative rounded-[16px] overflow-hidden shadow w-full h-[200px] sm:h-[250px] sm:col-span-2">
                        <img
                            src="/Chicago.png"
                            alt="Chicago, CG"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{ backgroundColor: "#020D16", opacity: 0.3 }}
                        />
                        <h3
                            className="absolute"
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 600,
                                fontSize: "20px",
                                lineHeight: "24px",
                                color: "#F7F7F7",
                                bottom: "60px",
                                left: "16px",
                                margin: 0,
                            }}
                        >
                            Chicago
                        </h3>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Los Angeles
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    New York
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Mexico City
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-center px-3 py-1"
                                style={{
                                    borderRadius: "800px",
                                    border: "1px solid #FFFFFF2E",
                                    backgroundColor: "#FFFFFF26",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Jost",
                                        fontWeight: 500,
                                        fontSize: "10px",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Toronto
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    className="
    mx-auto mt-10 
    flex items-center justify-center gap-3
    rounded-[8px]
    bg-[#C71F37]
    shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)]
    w-full max-w-[285px] h-[52px]
  "
                >
                    {/* Button Text */}
                    <span
                        style={{
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#FFFFFF',
                            textAlign: 'center',
                        }}
                    >
                        View All Featured Facilities
                    </span>

                    {/* Icon on the right */}
                    <img
                        src="/icons/arrow_btn.png"
                        alt="Arrow Icon"
                        className="w-[15.74px] h-[15.74px]" /* no absolute here */
                    />
                </button>


            </div>
        </section>


    );
}
