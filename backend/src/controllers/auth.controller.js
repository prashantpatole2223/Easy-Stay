import {
    loginUser, refreshSession, logoutSession,
    logoutAllSessions,
    customerSignupService,
    ownerSignupService
} from "../services/auth.services.js"

export const customerSignup = async (req, res) => {
    try {
        await customerSignupService(req.body);
        return res.status(201).json({
            success: true,
            message: "You are registered successfully"
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "server error"
        })
    }
}

export const ownerSignup = async (req, res) => {
    try {
        await ownerSignupService(req.body);
        return res.status(201).json({
            success: true,
            message: "You are registered successfully"
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "server error"
        })
    }
}

export const login = async (req, res) => {
    try {
        console.log('inside login controller');
        const data = await loginUser(req.body, {
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            device: req.headers["sec-ch-ua-platform"]
        });

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User loggedIn successfully",
            user: data.user
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "server error"
        })
    }
}

export const refresh = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = await refreshSession(req.cookies.refreshToken, {
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            device: req.headers["sec-ch-ua-platform"]
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            success: false,
            message: error.message || "Unauthorized"
        });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await logoutSession(refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

export const logoutAll = async (req, res) => {
    try {
        await logoutAllSessions(req.user.id);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out from all devices successfully"
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};