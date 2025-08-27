import { NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';
import { productionChannelStorage } from '@/lib/discord/channel-storage-db';

// Simulate a complete payment flow without actual Stripe charges
export async function POST(request: Request) {
  console.log('🧪 === END-TO-END TEST STARTED ===');
  
  try {
    const { planType = 'simple', customerEmail = 'test@example.com', customerName = 'Test User' } = await request.json();
    
    // Generate fake session ID (like Stripe would)
    const fakeSessionId = `cs_test_END2END_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🧪 Generated fake session ID:', fakeSessionId);
    
    const testResults: any = {
      sessionId: fakeSessionId,
      planType,
      customerEmail,
      steps: [],
      success: false,
      errors: []
    };
    
    // STEP 1: Test Discord Channel Creation
    console.log('🧪 STEP 1: Testing Discord channel creation...');
    try {
      const channelUrl = await discordAPI.createCustomerChannel({
        planType,
        customerEmail,
        orderId: fakeSessionId,
        customerName
      });
      
      if (channelUrl) {
        testResults.steps.push({
          step: 1,
          name: 'Discord Channel Creation',
          status: 'SUCCESS',
          result: channelUrl
        });
        testResults.channelUrl = channelUrl;
        console.log('✅ STEP 1 SUCCESS: Channel created:', channelUrl);
      } else {
        testResults.steps.push({
          step: 1,
          name: 'Discord Channel Creation',
          status: 'FAILED',
          error: 'No channel URL returned'
        });
        testResults.errors.push('Discord channel creation failed');
      }
    } catch (error) {
      testResults.steps.push({
        step: 1,
        name: 'Discord Channel Creation',
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.errors.push(`Discord error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
    
    // STEP 2: Test Production Storage
    if (testResults.channelUrl) {
      console.log('🧪 STEP 2: Testing production storage...');
      try {
        const storeSuccess = await productionChannelStorage.storeChannel(fakeSessionId, {
          channelUrl: testResults.channelUrl,
          planType,
          customerEmail,
          createdAt: Date.now()
        });
        
        if (storeSuccess) {
          testResults.steps.push({
            step: 2,
            name: 'Production Storage',
            status: 'SUCCESS',
            result: 'Channel stored successfully'
          });
          console.log('✅ STEP 2 SUCCESS: Channel stored');
        } else {
          testResults.steps.push({
            step: 2,
            name: 'Production Storage',
            status: 'FAILED',
            error: 'Storage returned false'
          });
          testResults.errors.push('Production storage failed');
        }
      } catch (error) {
        testResults.steps.push({
          step: 2,
          name: 'Production Storage',
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        testResults.errors.push(`Storage error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
      
      // STEP 3: Test Storage Retrieval
      console.log('🧪 STEP 3: Testing storage retrieval...');
      try {
        const retrievedChannel = await productionChannelStorage.getChannel(fakeSessionId);
        
        if (retrievedChannel && retrievedChannel.channelUrl === testResults.channelUrl) {
          testResults.steps.push({
            step: 3,
            name: 'Storage Retrieval',
            status: 'SUCCESS',
            result: retrievedChannel
          });
          console.log('✅ STEP 3 SUCCESS: Channel retrieved correctly');
        } else {
          testResults.steps.push({
            step: 3,
            name: 'Storage Retrieval',
            status: 'FAILED',
            error: retrievedChannel ? 'URL mismatch' : 'Channel not found'
          });
          testResults.errors.push('Storage retrieval failed');
        }
      } catch (error) {
        testResults.steps.push({
          step: 3,
          name: 'Storage Retrieval',
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        testResults.errors.push(`Retrieval error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
      
      // STEP 4: Test Admin Notification
      console.log('🧪 STEP 4: Testing admin notification...');
      try {
        await discordAPI.sendNotification(
          `🧪 **TEST - New Customer!** \n**Plan:** ${planType.toUpperCase()}\n**Email:** ${customerEmail}\n**Channel:** <${testResults.channelUrl}>\n**Amount:** €15 (TEST)`
        );
        
        testResults.steps.push({
          step: 4,
          name: 'Admin Notification',
          status: 'SUCCESS',
          result: 'Notification sent to #notifications'
        });
        console.log('✅ STEP 4 SUCCESS: Admin notification sent');
      } catch (error) {
        testResults.steps.push({
          step: 4,
          name: 'Admin Notification',
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        testResults.errors.push(`Notification error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }
    
    // STEP 5: Test Success Page API
    console.log('🧪 STEP 5: Testing success page API...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/channel?session=${fakeSessionId}`);
      const apiResult = await response.json();
      
      if (apiResult.found && apiResult.channelUrl) {
        testResults.steps.push({
          step: 5,
          name: 'Success Page API',
          status: 'SUCCESS',
          result: apiResult
        });
        console.log('✅ STEP 5 SUCCESS: Success page API works');
      } else {
        testResults.steps.push({
          step: 5,
          name: 'Success Page API',
          status: 'FAILED',
          error: 'API did not return channel'
        });
        testResults.errors.push('Success page API failed');
      }
    } catch (error) {
      testResults.steps.push({
        step: 5,
        name: 'Success Page API',
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.errors.push(`API test error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
    
    // Determine overall success
    const failedSteps = testResults.steps.filter((step: any) => step.status !== 'SUCCESS');
    testResults.success = failedSteps.length === 0;
    
    if (testResults.success) {
      console.log('🎉 === END-TO-END TEST COMPLETED SUCCESSFULLY ===');
    } else {
      console.log('❌ === END-TO-END TEST FAILED ===');
      console.log('Failed steps:', failedSteps);
    }
    
    // Clean up test data (optional)
    if (testResults.channelUrl) {
      console.log('🧹 Cleaning up test channel...');
      // Note: We could delete the test channel here if needed
      // For now, we'll leave it as evidence that the test worked
    }
    
    return NextResponse.json(testResults);
    
  } catch (error) {
    console.error('🧪 END-TO-END TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      steps: []
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'End-to-End Test Endpoint',
    usage: 'POST to this endpoint with optional: { planType: "simple", customerEmail: "test@example.com", customerName: "Test User" }',
    description: 'Tests complete payment flow without Stripe charges'
  });
}
