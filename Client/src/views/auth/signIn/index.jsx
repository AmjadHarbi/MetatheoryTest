import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";
import { ethers } from "ethers";
import DefaultAuth from "layouts/auth/Default";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [isLoding, setIsLoding] = useState(false);
  const [checkBox, setCheckBox] = useState(true);
  const [show, setShow] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const image = useSelector((state) => state?.images?.images);
  const showPass = () => setShow(!show);

  const initialValues = {
    username: "admin@gmail.com",
    password: "admin123",
  };

  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login(values, resetForm);
    },
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        toast.success("MetaMask connected!");
      } catch (error) {
        toast.error("MetaMask connection rejected.");
      }
    } else {
      toast.error("Please install MetaMask.");
    }
  };

  const login = async (values, resetForm) => {
    try {
      setIsLoding(true);
      const response = await postApi("api/user/login", values, checkBox);

      if (response && response.status === 200) {
        localStorage.setItem("token", response.data.token);
        dispatch(setUser(response?.data?.user));
        toast.success("Login Successfully!");
        resetForm();
        navigate("/superAdmin");
      } else {
        toast.error(response.response.data?.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <DefaultAuth
      illustrationBackground={image?.length > 0 && image[0]?.authImg}
      image={image?.length > 0 && image[0]?.authImg}
    >
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="fit-content"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            You must connect MetaMask before logging in.
          </Text>
        </Box>

        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          {!walletAddress ? (
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={connectWallet}
            >
              Connect MetaMask
            </Button>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <FormControl isInvalid={errors.username && touched.username}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Email<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  name="username"
                  type="email"
                  placeholder="mail@example.com"
                  fontWeight="500"
                  size="lg"
                  borderColor={
                    errors.username && touched.username ? "red.300" : null
                  }
                />
                {errors.username && touched.username && (
                  <FormErrorMessage mb="24px">
                    {errors.username}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Password */}
              <FormControl
                isInvalid={errors.password && touched.password}
                mb="24px"
              >
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Password<Text color={brandStars}>*</Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired
                    fontSize="sm"
                    placeholder="Enter Your Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="lg"
                    type={show ? "text" : "password"}
                    borderColor={
                      errors.password && touched.password ? "red.300" : null
                    }
                  />
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={showPass}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.password && touched.password && (
                  <FormErrorMessage mb="24px">
                    {errors.password}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Remember Me */}
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    onChange={(e) => setCheckBox(e.target.checked)}
                    id="remember-login"
                    value={checkBox}
                    defaultChecked
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color={textColor}
                    fontSize="sm"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormControl>
              </Flex>

              {/* Submit Button */}
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                type="submit"
                mb="24px"
                disabled={isLoding}
              >
                {isLoding ? <Spinner /> : "Sign In"}
              </Button>
            </form>
          )}
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
