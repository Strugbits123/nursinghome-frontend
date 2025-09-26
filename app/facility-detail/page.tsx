'use client'

import * as React from "react";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFacilities } from "../context/FacilitiesContext";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import FacilityServices from "../components/facilityDetail/FacilityServices";
import { Button } from "@/components/ui/button"
import { SearchNursing } from '../components/SearchNursing';
import { Footer } from '../components/Footer';

export default function FacilityDetailPage() {
    const router = useRouter();
    const { facilities } = useFacilities();
    const [openAuth, setOpenAuth] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [router])


    React.useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        toast.success("Logged out successfully!");
    };

    return (
        <>

            <header className="w-full h-[78px] bg-[#C71F37] border-b border-[#C71F37]">
                <div className="max-w-[1856px] h-[46px] mx-auto px-[32px] flex items-center justify-between">
                    {/* Logo */}
                    <img
                        src="/footer_icon.png"
                        alt="NursingHome Logo"
                        className="w-[176px] h-[47px] mt-7 ml-30"
                    />

                    {/* Navigation */}
                    <nav className="w-[357px] h-[65px] flex items-center space-x-8 mt-8 mr-50">
                        <a
                            href="#"
                            className="font-inter font-black text-[14px] leading-[13px] tracking-[0.2px] capitalize text-white"
                        >
                            Home
                        </a>
                        <a
                            href="#"
                            className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
                        >
                            What’s New!
                        </a>
                        <a
                            href="#"
                            className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
                        >
                            News
                        </a>
                        <a
                            href="#"
                            className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="w-[406.5px] h-[54px] flex items-center justify-end mt-9 mr-50 space-x-6">
                        {isAuthenticated ? (
                            <div
                                onClick={handleLogout}
                                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
                            >
                                <img
                                    src="/arrow-btn.png"
                                    alt="Logout icon"
                                    className="w-[18.78px] h-[18.78px] mr-2"
                                />
                                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                                    Logout
                                </span>
                            </div>
                        ) : (
                            <div
                                onClick={() => setOpenAuth(true)}
                                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
                            >
                                <img
                                    src="/icons/header_sign.png"
                                    alt="Sign in icon"
                                    className="w-[18.78px] h-[18.78px]  mr-2"
                                />
                                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                                    Sign In
                                </span>
                            </div>
                        )}

                        <button className="flex items-center justify-center w-[163.37px] h-[54px] bg-white hover:bg-[#a91a2e] rounded-[7.04px] px-4">
                            {/* <img
                src="/icons/faciltiy_search_svg.png"
                alt="Add icon"
                className="w-[18.78px] h-[18.78px] fill-red-500  mr-2 invert"
                /> */}
                            <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#c71f37]">
                                Add Listing
                            </span>
                        </button>
                    </div>
                </div>

                {/* Auth Modal */}
                <AuthModal
                    open={openAuth}
                    onOpenChange={(open) => {
                        setOpenAuth(open);
                        if (!open) {
                            setIsAuthenticated(!!localStorage.getItem("token"));
                        }
                    }}
                />
            </header>

            <section className="w-full h-[60px] bg-[#F5F5F5] flex items-center justify-between px-22 ">
                <div className="flex items-center gap-x-2 text-[#4B5563] mx-25 font-inter font-normal text-[16.28px] leading-[23.26px]">
                    <span className="align-middle">Home</span>
                    <img
                        src="/icons/search_fac_right_icon.png"
                        alt="Arrow"
                        className="w-[8.72px] h-[13.95px] align-middle"
                    />
                    <span className="align-middle">California</span>
                    <img
                        src="/icons/search_fac_right_icon.png"
                        alt="Arrow"
                        className="w-[8.72px] h-[13.95px] align-middle"
                    />
                    <span className="align-middle">Los Angeles</span>
                    <img
                        src="/icons/search_fac_right_icon.png"
                        alt="Arrow"
                        className="w-[8.72px] h-[13.95px] align-middle"
                    />
                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#111827] align-middle">
                        Sunset Manor Care Center
                    </span>
                </div>


                <button className="flex items-center gap-2 bg-[#F5F5F5] text-[#C71F37] px-4 mx-45 py-2 hover:bg-[#f5f5f5] transition">
                    <img
                        src="/icons/facility_search_heart_icon.png"
                        alt="Save icon"
                        className="w-[16.28px] h-[16.28px]"
                    />
                    <span className="font-inter font-normal text-[16.28px] leading-[23.26px] text-center">
                        Save Search
                    </span>
                </button>
            </section>

            <div className="w-full h-[572px] bg-white mt-[33px]">
                <div className="w-[1536px] h-[525px] mx-[192px] mt-[23px] bg-white p-6 flex space-x-6">
                    <div className="w-2/3 flex flex-col space-y-4 px-7 pt-1">
                        <h1 className="font-jost font-bold text-[45.47px] leading-[50.53px] text-[#111827]">
                            Sunset Manor Care Center
                        </h1>

                        <p className="font-inter font-normal text-[22.74px] leading-[35.37px] text-[#4B5563]">
                            1234 Sunset Boulevard, Los Angeles, CA 90028
                        </p>
                        <div className="flex items-center space-x-3 mt-4">
                            <button className="flex items-center px-4 h-[40.42px] w-[90px] rounded-[20px] bg-[#D02B38]">
                                <img
                                    src="/icons/Vector (3).png"
                                    alt="Star"
                                    className="w-[22.74px] h-[20.21px] mr-2"
                                />
                                <span className="font-inter font-bold text-[20.21px] leading-[30.32px] text-white">
                                    4.2
                                </span>
                            </button>
                            <div className="flex items-center space-x-6">
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#4B5563]">
                                    CMS Overall Rating
                                </span>
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="/icons/Bed_icon.png"
                                        alt="Beds"
                                        className="w-[22.1px] h-[17.68px]"
                                    />
                                    <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#4B5563]">
                                        120 Beds
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-4">
                            <div className="flex space-x-2 items-center w-[200px] h-[21px]">
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827]">
                                    Ownership:
                                </span>
                                <span className="font-inter font-medium text-[17.68px] leading-[25.26px] text-[#000000]">
                                    For-Profit
                                </span>
                            </div>
                            <div className="flex space-x-2 items-center w-[200px] h-[21px]">
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827]">
                                    License:
                                </span>
                                <span className="font-inter font-medium text-[17.68px] leading-[25.26px] text-[#000000]">
                                    #123456789
                                </span>
                            </div>
                            <div className="flex space-x-2 items-center w-[220px] h-[21px]">
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827]">
                                    Accepting:
                                </span>
                                <span className="font-inter font-medium text-[17.68px] leading-[25.26px] text-[#16A34A]">
                                    New Residents
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row space-x-6 mt-10">
                            <div className="w-[224px] h-[106px] bg-[#F5F5F5] rounded-[10.11px] flex flex-col items-center justify-center p-4">
                                <span className="font-inter font-bold text-[30.32px] leading-[40.42px] text-[#D02B38] text-center">
                                    4.2
                                </span>
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827] text-center mt-2">
                                    Overall Rating
                                </span>
                            </div>
                            <div className="w-[224px] h-[106px] bg-[#F5F5F5] rounded-[10.11px] flex flex-col items-center justify-center p-4">
                                <span className="font-inter font-bold text-[30.32px] leading-[40.42px] text-[#D02B38] text-center">
                                    3.8
                                </span>
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827] text-center mt-2">
                                    Health Inspections
                                </span>
                            </div>
                            <div className="w-[224px] h-[106px] bg-[#F5F5F5] rounded-[10.11px] flex flex-col items-center justify-center p-4">
                                <span className="font-inter font-bold text-[30.32px] leading-[40.42px] text-[#D02B38] text-center">
                                    4.5
                                </span>
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827] text-center mt-2">
                                    Staffing
                                </span>
                            </div>
                            <div className="w-[224px] h-[106px] bg-[#F5F5F5] rounded-[10.11px] flex flex-col items-center justify-center p-4">
                                <span className="font-inter font-bold text-[30.32px] leading-[40.42px] text-[#D02B38] text-center">
                                    4.1
                                </span>
                                <span className="font-inter font-normal text-[17.68px] leading-[25.26px] text-[#111827] text-center mt-2">
                                    Quality Measures
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="flex items-center justify-center w-[241.34px] h-[60.63px] bg-[#D02B38] rounded-[10.11px] hover:bg-red-700 transition gap-x-3">
                                <img
                                    src="/icons/Cell_phone_icon.png"
                                    alt="Contact Icon"
                                    className="w-[20.21px] h-[20.21px]"
                                />
                                <span className="font-inter font-medium text-[20.21px] leading-[30.32px] text-white">
                                    Contact Facility
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="w-1/4 flex flex-col space-y-4">
                        <div className="w-[458px] h-[323px] rounded-[10.11px] bg-[#F5F5F5] flex items-center justify-center">
                            <span className="font-inter font-medium text-[16px] text-[#111827]">
                                <img
                                    src="/modern nursing home exterior with beautiful landscaping and welcoming entrance.png"
                                    alt="Image 1"
                                    className="w-full h-full rounded-[10.11px] object-cover"
                                />
                            </span>
                        </div>
                        <div className="w-[458px] h-[23px] flex items-center  space-x-2 mt-12">
                            <div className="w-[146px] h-[101px] rounded-[5.05px] bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-[#111827]">
                                    <img
                                        src="/nursing home dining room with residents eating.png"
                                        alt="Image 1"
                                        className="w-full h-full rounded-[10.11px] object-cover"
                                    />
                                </span>
                            </div>
                            <div className="w-[146px] h-[101px] rounded-[5.05px] bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-[#111827]"> <img
                                    src="/nursing home activity room with elderly residents.png"
                                    alt="Image 1"
                                    className="w-full h-full rounded-[10.11px] object-cover"
                                /></span>
                            </div>
                            <div className="w-[146px] h-[101px] rounded-[5.05px] bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-[#111827]"> <img
                                    src="/nursing home garden courtyard with benches.png"
                                    alt="Image 1"
                                    className="w-full h-full rounded-[10.11px] object-cover"
                                /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-[854px] bg-[#F5F5F5] mt-[33px]">
                <div className="w-[1527px] h-[778px] mx-[192px] mt-[23px] bg-[#F5F5F5] p-6 flex flex-col space-y-6">
                    <h2 className="font-jost font-bold text-[32px] leading-[38.4px] text-[#111827] ml-10">
                        Services & Facility Details
                    </h2>
                    <p className="font-inter font-normal text-[18px] leading-[28px] text-[#707070] ml-10">
                        Comprehensive care services and amenities available
                    </p>

                    <div className="flex flex-row ml-10 space-x-6 mt-6">
                        <div className="w-[706.6px] h-[334.2px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
                            <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-4">
                                Medical Services
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img
                                        src="/icons/medical_icon1.png"
                                        alt="Nursing"
                                        className="w-[20.88px] h-[23.87px] mr-3 "
                                    />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        24/7 Nursing Care
                                    </span>
                                </div>
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img
                                        src="/icons/medical_icon2.png"
                                        alt=""
                                        className="w-[27px] h-[23.87px] mr-3 "
                                    />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Medication Management
                                    </span>
                                </div>
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon3.png" alt="" className="w-[23.88px] h-[23.87px] mr-3 " />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Skilled Doctors
                                    </span>
                                </div>
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon4.png" alt="" className="w-[23.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Emergency Response
                                    </span>
                                </div>
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon5.png" alt="" className="w-[20.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Pharmacy Support
                                    </span>
                                </div>
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon6.png" alt="" className="w-[20.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Rehab Programs
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-[706.6px] h-[334.2px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
                            <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-4">
                                Amenities & Activities
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img
                                        src="/icons/medical_icon1.png"
                                        alt="Nursing"
                                        className="w-[20.88px] h-[23.87px] mr-3 "
                                    />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Dining Room
                                    </span>
                                </div>

                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img
                                        src="/icons/medical_icon2.png"
                                        alt=""
                                        className="w-[27px] h-[23.87px] mr-3 "
                                    />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Music Therapy
                                    </span>
                                </div>

                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon3.png" alt="" className="w-[23.88px] h-[23.87px] mr-3 " />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Garden Courtyard
                                    </span>
                                </div>

                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon4.png" alt="" className="w-[23.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Activity Room
                                    </span>
                                </div>

                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon5.png" alt="" className="w-[20.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Library
                                    </span>
                                </div>

                                <div className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
                                    <img src="/icons/medical_icon6.png" alt="" className="w-[20.88px] h-[23.87px] mr-3" />
                                    <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
                                        Entertainment Room
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 ml-10">
                        <div className="w-[464.7px] h-[296px] bg-white rounded-[9.55px] [box-shadow:0px_1.19px_2.39px_0px_#0000000D] p-6">
                            <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-black mb-4">
                                Capacity & Rooms
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Total Beds:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        120
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Private Rooms:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        45
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Semi-Private:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        75
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Current Occupancy:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        92%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-[464.7px] h-[296px] bg-white rounded-[9.55px] [box-shadow:0px_1.19px_2.39px_0px_#0000000D] p-6">
                            <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-black mb-4">
                                Contact Information
                            </h3>

                            <div className="flex items-center mt-5 gap-3">
                                <img
                                    src="/icons/phone_icon.png"
                                    alt="Phone"
                                    className="w-[19.1px] h-[19.1px]"
                                />

                                <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-black">
                                    (323) 555-0123
                                </span>
                            </div>
                            <div className="flex items-center mt-4 gap-3">
                                <img
                                    src="/icons/email_icon.png"
                                    alt="email"
                                    className="w-[19.1px] h-[15px]"
                                />
                                <span className="font-inter font-[400] italic:false         
                                    text-[19.1px]       
                                    leading-[28.65px]   
                                    tracking-[0]        
                                    align-middle 
                                    text-black
                                    "
                                >
                                    info@sunsetmanor.com
                                </span>
                            </div>
                            <div className="flex items-center mt-4  gap-3">
                                <img
                                    src="/icons/location_icon (2).png"
                                    alt="Phone"
                                    className="w-[14.32px] h-[19.1px]"
                                />
                                <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-black">
                                    1234 Sunset Boulevard Los Angeles, CA 90028
                                </span>
                            </div>
                            <div className="flex items-center  mt-4 gap-3">
                                <img
                                    src="/icons/earth_icon.png"
                                    alt="Phone"
                                    className="w-[19.1px] h-[19.1px]"
                                />
                                <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-black">
                                    www.sunsetmanor.com
                                </span>
                            </div>

                        </div>

                        <div className="w-[464.7px] h-[296px] bg-white rounded-[9.55px] [box-shadow:0px_1.19px_2.39px_0px_#0000000D] p-6">
                            <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-black mb-4">
                                Visiting Hours
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Monday - Friday:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        9:00 AM - 8:00 PM
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Saturday:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        10:00 AM - 6:00 PM
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#4B5563]">
                                        Sunday:
                                    </span>
                                    <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-black">
                                        12:00 PM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center mt-10">
                                <img
                                    src="/icons/expectation_icon.png"
                                    alt="phone"
                                    className="w-[16.71px] h-[16.71px] mr-2"
                                />
                                <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                    Please call ahead to schedule visits
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <section className="max-w-[1714px] min-h-[1314px] mx-auto bg-white p-8">
                <div className="w-[1527.8px] h-[1187.62px] mx-auto p-6">
                    <h2 className="font-jost font-bold text-[32px] leading-[38.4px] text-[#111827] mb-4 ml-[50px]">
                        Google Reviews & AI Analysis
                    </h2>

                    <p className="font-inter font-normal text-[18px] leading-[28px] text-[#707070] ml-[50px] mb-8">
                        Real reviews from families and our AI-powered insights
                    </p>
                    <div className="flex gap-6">

                        <div className="flex-1 w-[954.87px] h-[1097.81px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] ml-10  p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827]">
                                    Recent Reviews
                                </h3>

                                <div className="flex items-center gap-2">
                                    <img
                                        src="/icons/star_icon.png"
                                        alt="star"
                                        className="w-[19.1px] h-[19.1px]"
                                    />
                                    <span className="font-inter font-bold text-[19.1px] leading-[28.65px] text-[#111827]">
                                        4.1
                                    </span>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        (47 reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="w-[897.58px] h-[211.26px] border-b-[1.19px] mt-8 border-gray-300 flex items-start ">
                                <img
                                    src="/Reviewer1.png"
                                    alt="Sarah Johnson"
                                    className="w-[57.29px] h-[57.29px] rounded-full object-cover mr-4"
                                />
                                <div className="flex flex-col ml-[20px]">
                                    <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                        Sarah Johnson
                                    </h4>
                                    <div className="flex items-center mt-1">
                                        <div className="flex mr-3">
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px]" />
                                        </div>
                                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            2 weeks ago
                                        </span>
                                    </div>
                                    {/* Description */}
                                    <p className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#374151] mt-3">
                                        "The staff at Sunset Manor has been incredibly caring and attentive to my mother&apos;s needs.
                                        The facility is clean, well-maintained, and the activities program keeps residents engaged.
                                        The nursing staff is professional and responsive to concerns. Highly recommend for families
                                        looking for quality care."
                                    </p>
                                </div>
                            </div>
                            <div className="w-[897.58px] h-[211.26px] border-b-[1.19px] mt-8 border-gray-300 flex items-start ">
                                <img
                                    src="/Reviewer2.png"
                                    alt="Michael Chen"
                                    className="w-[57.29px] h-[57.29px] rounded-full object-cover mr-4"
                                />
                                <div className="flex flex-col ml-[20px]">
                                    <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                        Michael Chen
                                    </h4>
                                    <div className="flex items-center mt-1">
                                        <div className="flex mr-3">
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/empty_star.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/empty_star.png" alt="star" className="w-[19.09px] h-[19.09px]" />
                                        </div>
                                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            1 month ago
                                        </span>
                                    </div>
                                    <p className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#374151] mt-3">
                                        "Good facility overall, but communication could be improved. Sometimes it's difficult to get
                                        updates on my father's condition. The dining options are limited, and the physical therapy
                                        program could use more resources. However, the location is convenient and the rooms are
                                        comfortable."
                                    </p>
                                </div>
                            </div>
                            <div className="w-[897.58px] h-[211.26px] border-b-[1.19px] mt-8 border-gray-300 flex items-start ">
                                <img
                                    src="/Reviewer3.png"
                                    alt="Linda Martinez"
                                    className="w-[57.29px] h-[57.29px] rounded-full object-cover mr-4"
                                />
                                <div className="flex flex-col ml-[20px]">
                                    <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                        Linda Martinez
                                    </h4>
                                    <div className="flex items-center mt-1">
                                        <div className="flex mr-3">
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px]" />
                                        </div>
                                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            2 months ago
                                        </span>
                                    </div>
                                    {/* Description */}
                                    <p className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#374151] mt-3">
                                        "Exceptional care and attention to detail. The medical director is excellent and the nursing
                                        staff genuinely cares about residents. My grandmother has been here for 6 months and
                                        has shown remarkable improvement in her mobility and mood. The family support services
                                        are also very helpful."
                                    </p>
                                </div>
                            </div>
                            <div className="w-[897.58px] h-[211.26px] mt-8 border-gray-300 flex items-start ">
                                <img
                                    src="/Reviewer4.png"
                                    alt="Robert Davis"
                                    className="w-[57.29px] h-[57.29px] rounded-full object-cover mr-4"
                                />
                                <div className="flex flex-col ml-[20px]">
                                    <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                        Robert Davis
                                    </h4>
                                    <div className="flex items-center mt-1">
                                        <div className="flex mr-3">
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/star_icon.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/empty_star.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/empty_star.png" alt="star" className="w-[19.09px] h-[19.09px] mr-1" />
                                            <img src="/icons/empty_star.png" alt="star" className="w-[19.09px] h-[19.09px]" />
                                        </div>
                                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            3 months ago
                                        </span>
                                    </div>
                                    <p className="font-inter font-normal text-[19.1px] leading-[28.65px] text-[#374151] mt-3">
                                        "Mixed experience. Some staff members are wonderful, but there seems to be high
                                        turnover which affects consistency of care. The facility needs some updates to common
                                        areas. Pricing is competitive for the area, but I wish there were more specialized programs
                                        available."
                                    </p>
                                </div>
                            </div>
                            <Button className="mt-1 w-[154.57px] h-[28.65px] text-[19.1px] leading-[28.65px] font-inter font-medium text-[#D02B38] bg-transparent hover:bg-transparent shadow-none">
                                View All Reviews
                            </Button>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="w-[458.34px] h-[486.98px] rounded-[9.55px] bg-[#F5F5F5] p-4">
                                <div className="ml-4">
                                    <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mt-5 mb-4">
                                        AI-Generated Summary
                                    </h3>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <img src="/icons/like_icon.png" alt="Pros" className="w-[19.09px] h-[19.09px]" />
                                        <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#16A34A]">
                                            Pros
                                        </span>
                                    </div>
                                    {/* Pros List */}
                                    <div className="mt-2 w-[401.05px] h-[157.55px] flex flex-col gap-3">
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/check_icon.png" alt="icon" className="w-[12.53px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Caring and attentive nursing staff
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/check_icon.png" alt="icon" className="w-[12.53px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Clean and well-maintained facilities
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/check_icon.png" alt="icon" className="w-[12.53px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Engaging activities program
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/check_icon.png" alt="icon" className="w-[12.53px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Professional medical director
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/check_icon.png" alt="icon" className="w-[12.53px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Convenient location
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-7 space-x-2">
                                        <img src="/icons/dislike_icon.png" alt="Cons" className="w-[19.09px] h-[19.09px]" />
                                        <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#DC2626]">
                                            Cons
                                        </span>
                                    </div>
                                    {/* Cons List */}
                                    <div className="mt-2 w-[401.05px] h-[157.55px] flex flex-col gap-3">
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/cross_icon.png" alt="icon" className="w-[10.74px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Communication could be improved
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/cross_icon.png" alt="icon" className="w-[10.74px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Limited dining options
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/cross_icon.png" alt="icon" className="w-[10.74px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                High staff turnover
                                            </span>
                                        </div>
                                        <div className="flex items-center h-[23.87px]">
                                            <img src="/icons/cross_icon.png" alt="icon" className="w-[10.74px] h-[14.32px]" />
                                            <span className="ml-2 font-inter font-normal text-[16.71px] leading-[23.87px] text-[#374151]">
                                                Common areas need updates
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[458.34px] h-[286.46px] rounded-[9.55px] bg-white border border-[#E5E7EB] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
                                <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-6">
                                    Review Distribution
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
                                        5★
                                    </span>
                                    <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full" style={{ width: '142.74px' }}></div>
                                    </div>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        21
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
                                        4★
                                    </span>
                                    <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full" style={{ width: '94.96px' }}></div>
                                    </div>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        14
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
                                        3★
                                    </span>
                                    <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full" style={{ width: '48.7px' }}></div>
                                    </div>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        7
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
                                        2★
                                    </span>
                                    <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full" style={{ width: '26px' }}></div>
                                    </div>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        4
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 mt-3">
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
                                        1★
                                    </span>
                                    <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full" style={{ width: '6.54px' }}></div>
                                    </div>
                                    <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                        1
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
           <section className="w-[2134px] h-[1094px] bg-[#F5F5F5] opacity-100 p-2 mx-auto">
                {/* Inner Container */}
                <div className="w-[1527.8px] h-[1016.94px] ml-[220px] mt-5 bg-gray-100 rounded-lg flex flex-col gap-6 p-6">
                    {/* Heading */}
                    <h2 className="font-jost font-bold text-[32px] leading-[38.4px] text-[#111827]">
                    CMS Performance Data
                    </h2>

                    <p className="font-inter font-normal text-[18px] leading-[28px] text-[#707070]" style={{ width: '576.6px' }}>
                        Official data from the Centers for Medicare & Medicaid Services
                    </p>

                    {/* Cards Container */}
                    <div className="flex flex-wrap gap-6 mt-2">
                    {/* First Row: 3 Cards */}
                    <div className="w-[464.7px] h-[463.11px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col">
                        {/* Card Heading */}
                        <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mt-5 ml-3 mb-4">
                            Overall Rating
                        </h3>
                        <div className="w-[407.41px] h-[229.17px] bg-white ml-3 mb-4">
                            <img
                            src="/Container (1).png"
                            alt="Rating Chart"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Health Inspections
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                            3.8/5
                            </span>
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Staffing
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                            4.5/5
                            </span>
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Quality Measures
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                            4.1/5
                            </span>
                        </div>
                    </div>
                   <div className="w-[464.7px] h-[463.11px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col">
                        <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mt-5 ml-3 mb-4">
                           Staffing Levels
                        </h3>
                        <div className="w-[407.41px] h-[229.17px] bg-white ml-3 mb-4">
                            <img
                            src="/Container (2).png"
                            alt="Rating Chart"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                RN Hours per Resident Day
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                             0.75
                            </span>
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Total Nurse Hours
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                            3.2
                            </span>
                            
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Turnover Rate
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#000000]">
                            65%
                            </span>
                            
                        </div>
                    </div>
                   <div className="w-[464.7px] h-[463.11px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col">
                        <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mt-5 ml-3 mb-4">
                            Quality Measures
                        </h3>
                        <div className="w-[407.41px] h-[229.17px] bg-white  ml-3 mb-4">
                            <img
                            src="/Container (3).png"
                            alt="Rating Chart"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Antipsychotic Use
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#16A34A]">
                            12.3%
                            </span>
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Pressure Ulcers
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#16A34A]">
                            2.1%
                            </span>
                        </div>
                         <div className="flex justify-between items-center mt-2 ml-3 mr-3">
                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Quality Measures
                            </span>
                            <span className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#CA8A04]">
                            4.2%
                            </span>
                        </div>
                    </div>

                    {/* Second Row: 2 Cards */}
                    <div className="w-[711.38px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4">
                        {/* Heading */}
                        <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827]">
                            Recent Health Inspections
                        </h3>

                            {/* Two rows */}
                            <div className="flex flex-col gap-4 mt-4">
                                <div className="w-full bg-[#FFFFFF] border-l-[4.77px] border-l-[#D02B38] p-4 flex flex-col gap-2">
                                        {/* Heading row */}
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                            Standard Health Inspection
                                            </h4>
                                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            March 15, 2024
                                            </span>
                                        </div>

                                        {/* Description row */}
                                        <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            3 deficiencies found - All corrected
                                        </p>

                                        {/* Status row with icon */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <img
                                            src="/icons/right_icon (2).png"
                                            alt="Passed"
                                            className="w-[19.09px] h-[19.09px]"
                                            />
                                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#16A34A]">
                                            Passed
                                            </span>
                                        </div>
                                </div>

                                <div className="w-full bg-[#FFFFFF] border-l-[4.77px] border-l-[#FACC15] p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-inter font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                            Complaint Investigation
                                            </h4>
                                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            January 8, 2024
                                            </span>
                                        </div>
                                        <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                                            1 deficiency found - Under review
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <img
                                            src="/icons/timer_icon.png"
                                            alt="Passed"
                                            className="w-[19.09px] h-[19.09px]"
                                            />
                                            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#CA8A04]">
                                            In Progress
                                            </span>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-[711.38px] h-[415.37px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col gap-4">
                            <div className="ml-4 mt-1">
                                {/* Main Heading */}
                                <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827]">
                                Ownership & Financial
                                </h3>

                                {/* Sub Heading */}
                                <h4 className="font-inter mt-4 ml-1 font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                Ownership Information
                                </h4>
                            </div>

                            {/* Row with Texts */}
                            
                            <div className="flex justify-between items-center mx-5">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                Type:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#000000]">
                                For-Profit Corporation
                                </span>
                            </div>
                            <div className="flex justify-between items-center mx-5 ">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                Parent Company:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#000000]">
                                Sunset Healthcare Group
                                </span>
                            </div>
                            <div className="flex justify-between items-center mx-5 ">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                Administrator:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#000000]">
                                Maria Rodriguez, RN
                                </span>
                            </div>

                             {/* Sub Heading */}
                            <h4 className="font-inter mt-3 ml-4 font-medium text-[19.1px] leading-[28.65px] text-[#111827]">
                                Financial Performance
                            </h4>
                             {/* Row with Texts */}
                            
                            <div className="flex justify-between items-center mx-5">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                    Medicare Certified:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#16A34A]">
                                    Yes
                                </span>
                            </div>
                            <div className="flex justify-between items-center mx-5 ">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                Medicaid Certified:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#16A34A]">
                                    Yes
                                </span>
                            </div>
                            <div className="flex justify-between items-center mx-5 ">
                                <span className="font-inter font-normal text-[19.1px] leading-[20px] text-[#4B5563]">
                                    Accepts Private Pay:
                                </span>
                                <span className="font-inter font-medium text-[19.1px] leading-[20px] text-[#16A34A]">
                                    Yes
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

{/* Section */}
<div className="w-[1990px] h-[992px] bg-[#F5F5F5] flex items-center justify-center mx-auto">
  {/* Inner container */}
  <div
    className="
      w-[1527.8px]
      h-[878.48px]
      bg-[#F5F5F5]
      p-6
      flex 
      flex-col 
      lg:flex-row 
      gap-2   /* reduce from gap-6 to gap-2 or gap-0 */
    "
  >
    <div className="flex flex-col w-2/3 ml-3">
      <h2 className="font-jost font-bold text-[32px] leading-[38.4px] text-[#111827]">
        Location & Directions
      </h2>

      <p
        className="font-inter font-normal text-[18px] leading-[28px] text-[#707070] mt-[12px]"
        style={{ width: '428.77px' }}
      >
        Find us easily with detailed location information
      </p>

      {/* Map container card */}
      <div
        className="
          w-[954.87px]
          h-[515.63px]
          bg-white
          rounded-[9.55px]
          shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)]
          mt-4
          flex 
          items-center 
          justify-center
        "
      >
        {/* Map image */}
        <img
          src="/map_location.png"
          alt="Map"
          className="
            w-[897.58px]
            h-[458.34px]
            rounded-[9.55px]
            bg-[#D1D5DB]
            object-cover
          "
        />
      </div>
    </div>

    {/* RIGHT COLUMN – 3 boxes */}
    <div className="flex flex-col w-1/3 gap-2 mt-24">  {/* reduce gap from 4 to 2 */}
        <div className="w-[458.34px] h-[253.04px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-6">
            <h3
                className="
                font-inter 
                font-bold 
                text-[23.87px] 
                leading-[33.42px] 
                text-[#111827]
                "
            >
                Address &amp; Contact
            </h3>

        
                    {/* Row 1 */}
                    <div className="flex items-start mt-4 gap-3">
                        <img
                            src="/icons/location_icon (2).png"  
                            alt="Location Icon"
                            className="w-[14.32px] mt-2 h-[19.09px] object-contain"
                        />
                        {/* Text */}
                        <p className="font-inter font-medium text-[19.1px] w-[200px] leading-[22.65px] text-[#000000]">
                            1234 Sunset Boulevard{" "}
                            <span className="font-inter font-normal text-[19.1px] leading-[25.65px] text-[#000000]">
                            Los Angeles, CA 90028
                            </span>
                        </p>
                    </div>

                    <div className="flex items-start gap-3 mt-2">
                        <img
                        src="/icons/phone_icon.png"
                        alt="Phone"
                        className="w-[19.09px] h-[19.09px] object-contain mt-3"
                        />
                        <p className="mt-2 font-inter font-medium text-[19.1px] leading-[22.65px] text-[#000000]">
                        (123) 456-7890
                        </p>
                    </div>

                    <div className="flex items-start gap-3 mt-3.5">
                        <img
                        src="/icons/message_icon.png"
                        alt="Email"
                        className="w-[19.09px] h-[14.09px] object-contain mt-3"
                        />
                        <p className="mt-1 font-inter font-medium text-[19.1px] leading-[22.65px] text-[#000000]">
                        info@sunsetmanor.com
                        </p>
                    </div>

                    
                </div>

                <div className="w-[458.34px] h-[253.04px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-6">
                    <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-4">
                        Transportation
                    </h3>
                    <div className="flex items-center gap-3 mt-5">
                        <img
                        src="/icons/transpotation_icon.png"
                        alt="Bus Icon"
                        className="w-[19.09px] h-[19.09px]"
                        />
                        <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000]">
                        Bus Lines 2, 4, 302 nearby
                        </p>
                    </div>
                     <div className="flex items-center gap-3 mt-5">
                        <img
                        src="/icons/car_icon.png"
                        alt="Bus Icon"
                        className="w-[19.09px] h-[19.09px]"
                        />
                        <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000]">
                        Free visitor parking available
                        </p>
                    </div>
                     <div className="flex items-center gap-3 mt-5">
                        <img
                        src="/icons/wheel_chair_icon.png"
                        alt="Bus Icon"
                        className="w-[19.09px] h-[19.09px]"
                        />
                        <p className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000]">
                        Wheelchair accessible entrance
                        </p>
                    </div>
                </div>
                <div className="w-[458.34px] h-[253.04px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-6">
                    <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-4">
                        Nearby Services
                    </h3>
                   {/* Row with two texts */}
                    <div className="flex justify-between items-center mx-3 mt-2">
                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Hospital:
                        </span>
                        <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#000000]">
                            0.8 miles
                        </span>
                    </div>
                     <div className="flex justify-between items-center mx-3 mt-2">
                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Pharmacy:
                        </span>
                        <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#000000]">
                            0.3 miles
                        </span>
                    </div>
                    <div className="flex justify-between items-center mx-3 mt-2">
                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Shopping:
                        </span>
                        <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#000000]">
                            0.5 miles
                        </span>
                    </div>
                    <div className="flex justify-between items-center mx-3 mt-2">
                        <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
                            Restaurant:
                        </span>
                        <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#000000]">
                            0.2 miles
                        </span>
                    </div>
                </div>
            </div>
        </div>
        </div>










  




        {/* <SearchNursing />
        <Footer /> */}

        </>

    )
}
