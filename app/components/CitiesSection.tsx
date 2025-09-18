"use client";

import React from "react";

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
            style={{ height: "958px" }}
        >
            {/* inner div */}
            <div
                className="bg-[#F9F9F9] mx-auto"
                style={{
                    width: "1320px",
                    height: "753.52px",
                    marginTop: "68px",
                }}
            >
                {/* heading */}
                <h2
                    className="text-center font-bold"
                    style={{
                        fontFamily: "Jost",
                        fontSize: "32px",
                        lineHeight: "38.4px",
                        color: "#2B2B2B",
                        marginTop: "20px",
                    }}
                >
                    Explore Listings By{" "}
                    <span style={{ color: "#C71F37" }}>Cities</span>
                </h2>

                {/* description */}
                <div className="flex justify-center mt-4">
                    <p
                        style={{
                            width: "554px",
                            fontFamily: "Inter",
                            fontWeight: 400,
                            fontSize: "18px",
                            lineHeight: "28px",
                            color: "#707070",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Our clients love our services and give great &amp; positive reviews
                    </p>
                </div>

                {/* custom grid */}


                <div className="relative mt-8 grid grid-cols-[636px_306px_306px] gap-4">

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
                <div className="mt-4 grid grid-cols-[306px_306px_636px] gap-4">
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
                {/* Button */}
                <button
                    className="
    mx-auto mt-10 
    flex items-center justify-center gap-3
    rounded-[8px]
    bg-[#C71F37]
    shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)]
  "
                    style={{ width: '285px', height: '52px' }}
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
                        src="/arrow-btn.png"
                        alt="Arrow Icon"
                        className="w-[15.74px] h-[15.74px]" /* no absolute here */
                    />
                </button>


            </div>
        </section>


    );
}
