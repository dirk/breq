describe('breq', function(){
  it('should perform a GET', function(done){
    Breq.request({
      url: '/get',
      success: function(data, status, xhr){
        expect(data).to.eql('GET')
        expect(status).to.eql('success')
        expect(xhr).to.be.ok()
        done()
      }
    })
  })
  it('should perform a POST', function(done){
    Breq.request({
      url: '/post',
      method: 'post',
      data: 'foo=bar',
      success: function(data, status, xhr){
        expect(data).to.eql('bar')
        expect(status).to.eql('success')
        expect(xhr).to.be.ok()
        done()
      }
    })
  })
  it('should error', function(done){
    Breq.request({
      url: '/404',
      error: function(xhr, errorType, error){
        expect(xhr).to.be.ok()
        expect(errorType).to.eql('error')
        expect(error).to.be.ok()
        done()
      }
    })
  })
  it('should timeout', function(done){
    Breq.request({
      url: '/timeout',
      timeout: 100,
      error: function(xhr, errorType, error){
        expect(xhr).to.be.ok()
        expect(errorType).to.eql('timeout')
        done()
      }
    })
  })
  it('should abort', function(done){
    var xhr = Breq.request({
      url: '/get',
      beforeSend: function(xhr){
        expect(xhr).to.be.ok()
        return false
      }
    })
    expect(xhr).to.be(false)
    done()
  })
})
