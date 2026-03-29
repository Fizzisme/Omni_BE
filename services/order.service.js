import {categoryModel} from "../models/category.model.js";
import {AI_URL} from "../utils/constants.js";
import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
import {OrderModel, orderModel} from "../models/order.model.js";
import {userModel} from "../models/user.model.js";
import {env} from "../config/environment.js";
import nodemailer from "nodemailer";
import {Resend} from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});
// const sendOrderSuccessEmail = async (email, order) => {
//     const mailOptions = {
//         from: `"Omnicart" <${env.MAIL_USER}>`,
//         to: email,
//         subject: "Order Confirmation - Omnicart",
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
//                 <h2 style="color: #e87722;">Order Confirmed</h2>
//
//                 <p>Hi ${order.customer?.firstName || email},</p>
//
//                 <p>Your order has been successfully placed.</p>
//
//                 <div style="
//                     background: #fff5ee;
//                     padding: 16px;
//                     border-radius: 8px;
//                     margin: 20px 0;
//                 ">
//                     <p><b>OrderId:</b> #${order._id}</p>
//                     <p><b>Total:</b> $${order.total}</p>
//                     <p><b>Status:</b> ${order.status}</p>
//                 </div>
//
//                 <p>We will process your order shortly.</p>
//
//                 <p style="color:#999; font-size: 13px;">
//                     Thank you for shopping with Omnicart
//                 </p>
//             </div>
//         `,
//     };
//
//     await transporter.sendMail(mailOptions);
// };

export const sendOrderSuccessEmail = async (email, order) => {
    await resend.emails.send({
        from: "Omnicart <onboarding@resend.dev>", // chưa có domain thì dùng cái này
        to: email,
        subject: "Order Confirmation - Omnicart",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
                <h2 style="color: #e87722;">Order Confirmed</h2>

                <p>Hi ${order.customer?.firstName || email},</p>

                <p>Your order has been successfully placed.</p>

                <div style="
                    background: #fff5ee;
                    padding: 16px;
                    border-radius: 8px;
                    margin: 20px 0;
                ">
                    <p><b>OrderId:</b> #${order._id}</p>
                    <p><b>Total:</b> $${order.total}</p>
                    <p><b>Status:</b> ${order.status}</p>
                </div>

                <p>We will process your order shortly.</p>

                <p style="color:#999; font-size: 13px;">
                    Thank you for shopping with Omnicart
                </p>
            </div>
        `,
    });
};


// const sendOrderStatusEmail = async (email, order, reason) => {
//     const isApproved = order.status === "APPROVE";
//
//     const mailOptions = {
//         from: `"Omnicart" <${env.MAIL_USER}>`,
//         to: email,
//         subject: isApproved
//             ? "✅ Order Approved - Omnicart"
//             : "❌ Order Rejected - Omnicart",
//
//         html: `
//             <div style="font-family: Arial; max-width: 520px; margin:auto;">
//                 <h2 style="color:${isApproved ? "#22c55e" : "#ef4444"};">
//                     ${isApproved ? "Order Approved 🎉" : "Order Rejected ⚠️"}
//                 </h2>
//
//                 <p>Order ID: <b>${order._id}</b></p>
//                 <p>Total: <b>$${order.total.toLocaleString()}</b></p>
//
//                 ${
//             isApproved
//                 ? `<p>Your order has been approved and is being processed.</p>`
//                 : `
//                         <p>Your order has been rejected due to potential fraud risk.</p>
//                         <div style="
//                             background:#fff1f2;
//                             padding:12px;
//                             border-radius:6px;
//                             margin-top:10px;
//                         ">
//                             <b>Reason:</b> ${reason || "High risk detected by AI system"}
//                         </div>
//                     `
//         }
//
//                 <p style="margin-top:20px; font-size:13px; color:#888;">
//                     If you believe this is a mistake, please contact support.
//                 </p>
//             </div>
//         `,
//     };
//
//     await transporter.sendMail(mailOptions);
// };
export const sendOrderStatusEmail = async (email, order, reason) => {
    const isApproved = order.status === "APPROVE";

    await resend.emails.send({
        from: "Omnicart <onboarding@resend.dev>",
        to: email,
        subject: isApproved
            ? "✅ Order Approved - Omnicart"
            : "❌ Order Rejected - Omnicart",

        html: `
            <div style="font-family: Arial; max-width: 520px; margin:auto;">
                <h2 style="color:${isApproved ? "#22c55e" : "#ef4444"};">
                    ${isApproved ? "Order Approved 🎉" : "Order Rejected ⚠️"}
                </h2>

                <p>Order ID: <b>${order._id}</b></p>
                <p>Total: <b>$${order.total.toLocaleString()}</b></p>

                ${
            isApproved
                ? `<p>Your order has been approved and is being processed.</p>`
                : `
                            <p>Your order has been rejected due to potential fraud risk.</p>
                            <div style="
                                background:#fff1f2;
                                padding:12px;
                                border-radius:6px;
                                margin-top:10px;
                            ">
                                <b>Reason:</b> ${reason || "High risk detected by AI system"}
                            </div>
                        `
        }

                <p style="margin-top:20px; font-size:13px; color:#888;">
                    If you believe this is a mistake, please contact support.
                </p>
            </div>
        `,
    });
};
const create = async (data) => {

    const category = await categoryModel.findById(data.items[0].categoryId);

    const now = new Date();

    const dataCheck = {
        payment_method: data.payment.method,
        product_category: category.name,
        quantity: data.items[0].quantity,
        customer_age: data.customer.age,
        device_used: "PC",
        account_age_days: data?.account_age_days || 0,
        month: now.getMonth() + 1,
        day: now.getDate(),
        quarter: Math.floor((now.getMonth()) / 3) + 1,
        is_weekend: [0, 6].includes(now.getDay()),
        log_transaction_amount: Math.log(data.total + 1),
        is_night: now.getHours() >= 22 || now.getHours() <= 5,
        high_amount: data.total > 650,
        new_account: data?.accountAgeDays < 30 ? 1 : 0
    }

    const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataCheck),
    });

    if (!res.ok) {
        throw new ApiError(StatusCodes.BAD_REQUEST,"AI service error");
    }

    const result = await res.json();

    const user = await userModel.findByEmail(data.customer.email);

    const orderCreated = await orderModel.createNew(
        {
            userId: user?._id  || null,
            customer: user?._id ? {
                email: user.email,
                } : {
                email: data.customer.email,
                firstName: data.customer.firstName,
                lastName: data.customer.lastName,
                phone: data.customer.phone,
                address: data.customer.address,
            },
            paymentMethod: data.payment.method,
            total: data.total,
            items: data.items,
            aiAnalyst: result,
            status: result.fraud === 1 ? "PENDING" : "APPROVE"
        }
    )
    if(!orderCreated) throw new ApiError(StatusCodes.BAD_REQUEST,"Tao don hang that bai");
    const emailToSend = data.customer.email;

    await sendOrderSuccessEmail(emailToSend, orderCreated);
    return orderCreated;
}

const getAll = async () => {
    return await orderModel.getAll()
}

const getById = async (id) => {
    return await orderModel.getById(id);
}

const update = async (id,data) => {
    const order = await orderModel.getById(id);
    if(order.status !== 'PENDING') throw new ApiError(StatusCodes.BAD_REQUEST,"AI service error");
    const updatedOrder = await orderModel.update(id,data)
    const user = await userModel.findById(order.userId);
    const emailToSend = user.authProviders[0].email;
    sendOrderStatusEmail(
        emailToSend,
        updatedOrder,
        data.reason // nếu reject có reason
    ).catch(err => console.error("Send mail failed:", err));

    return updatedOrder;
}

const getRevenueByMonth = async (month,year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lt: end },
                status: "APPROVE",
            },
        },
        {
            $group: {
                _id: { $dayOfMonth: "$createdAt" },
                revenue: { $sum: "$total" },
            },
        },
    ]);

    return result;
}
const getMyOrders = async (user) => {
    const userExisted = await userModel.findById(user._id);
    if(!userExisted) throw new ApiError(StatusCodes.NOT_FOUND,"Khong tim thay user");
    const orders = await orderModel.getMyOrders(user._id)
    return orders;
}

const getMyOrder = async (user, id) => {
    const userExisted = await userModel.findById(user._id);
    if (!userExisted) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy user");
    }

    const order = await orderModel.getMyOrder(user._id, id);
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy order");
    }


    return  {
        ...order.toObject(),
        customer: {
            _id: userExisted._id,
            email: userExisted.authProviders[0].email,
            role: userExisted.role,
            address: userExisted.address,
            age: userExisted.age,
            firstName: userExisted.firstName,
            lastName: userExisted.lastName,
            phone: userExisted.phoneNumber,
            gender: userExisted.gender
        },
    };
};



export const orderService = {
    create,
    getAll,
    getById,
    update,
    getRevenueByMonth,
    getMyOrders,
    getMyOrder
}